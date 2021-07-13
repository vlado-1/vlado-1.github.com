#include<stdio.h>
#include<stdlib.h>

//Linked List Struct//

struct list{
	int value;
	size_t relative_address;
	struct list* next;
};


//Static Variables.//

unsigned char registers[8] = {0,0,0,0,0,0,0,0};

static size_t program_counter = 0;
struct list* stack_pointer;
struct list** stackFramePnters;

int nofStackFrames = 0;
int sizeOfStackFrameArray = 0;


/*Get the File size*/
int getFileSize(FILE* fp){
	int endseek = fseek(fp, 0, SEEK_END);
	if(endseek != 0){
		printf("File size could not be determined.\n");
		return -1;
	}
	size_t size = ftell(fp);
	int reset = fseek(fp, 0, SEEK_SET);
	if(reset != 0){
		printf("File position could not be reset.\n");
		return -1;
	}
	else if(size <= 1){
		printf("The File size is too small to be runable.\n");
		return -1;
	}
	return size;
}

void bit_copy(unsigned char* bin_buff, unsigned char* bin, size_t size){
	/*Use big endian form of storage for bits.*/
	for(int i = 0; i < size; i++){
		for(int n = 7; n >= 0; n--){
			unsigned char c = !!((1<<n) & bin[i]);
			int inc = 7 - n;/*Solution to issue of inverted bits in array*/
			bin_buff[i*8 + inc] = c;
			printf("%d", c);
		}
	}
	printf("\n");
}
/*Returns a positive integer representing the operation code,
  or negative integer to show an error occured.
  # 0 => MOV
  # 1 => CAL
  # 2 => POP
  # 3 => RET
  # 4 => ADD
  # 5 => AND
  # 6 => NOT
  # 7 => EQU
  */
int determineOPcode(unsigned char* opCodeAddress){
	int opcode = 0;
	for(int i = 0; i<3; i++){
		int placevalue = -1;
		if(i==0){
			placevalue = 4;
		}
		else if (i==1){
			placevalue = 2;
		}
		else if (i==2){
			placevalue = 1;
		}
		if(placevalue < 0){
			return placevalue;
		}

		switch(opCodeAddress[i]){
			case 0:
				opcode += 0;
				break;
			case 1:
				opcode += placevalue;
				break;
			default:
				opcode = -1;
				return opcode;
		}
	}
	return opcode;
}

/*Returns a positive integer to represent the type of value in instruction,
  or negative integer to represent error.
  # 0 => 8 bit long value.
  # 1 => 3 bit long register @.
  # 2 => 7 bit long stack @.
  # 3 => 7 bit long pointer value.*/
int determineType(unsigned char* typeAddress){

	int type = 0;
	for(int i = 0; i<2; i++){
		int placevalue = -1;
		if(i==0){
			placevalue = 2;
		}
		else if (i==1){
			placevalue = 1;
		}
		if(placevalue < 0){
			return placevalue;
		}

		switch(typeAddress[i]){
			case 0:
				type += 0;
				break;
			case 1:
				type += placevalue;
				break;
			default:
				type = -1;
				return type;
		}
	}
	return type;
}
/*Returns 0 upon successfully determing the index values of the
  operation codes within binarybuffer array.
  Returns non-zero upon failure.
  (EXCLUDE OP CODE AND TYPE bits)
  # MOV => Binary => skip 6,10,11,14,15 (+4).
  # CAL => Binary => skip 15 (+2).
  # POP => empty
  # RET => empty
  # ADD => Binary => skip 6 bits (+4).
  # AND => Binary => skip 6 bits (+4).
  # NOT => Unary => skip 3 bits (+2).
  # EQU => Unary => skip 3 bits (+2).*/
int getOPcodeINDEX(unsigned char* bin_buf, int*opCodeIndArr, size_t opInd_sz, size_t bin_buf_sz ){
	size_t end = bin_buf_sz;
	int counter = end;
	long int index = opInd_sz - 2;
	while((index >= 0)&&(counter > 0)){
		counter = counter - 3;
		printf("Counter is: %d ", counter);
		int opcode = determineOPcode(bin_buf + counter);
		opCodeIndArr[index] = counter;
		index = index - 1;
		switch(opcode){
			case 7: case 6:
				printf("EQU or NOT\n");
				counter = counter - 5;
				break;
			case 5: case 4:
				printf("ADD or AND\n");
				counter = counter - 10;
				break;
			case 3:
				printf("RET\n");
				break;
			case 2:
				printf("POP\n");
				counter = counter - 9;
				break;
			case 1:
				printf("CAL\n");
				counter = counter - 17;
				break;
			case 0:
				printf("MOV\n");
				/*Check type and respond appropriately*/
				for(int j = 1; j <= 2; j++){
					counter--;
					counter--;
					int type = determineType(bin_buf + counter);
					switch(type){
						case 0:
							counter = counter - 8;
							printf("Counter is: %d VAL\n", counter);
							break;
						case 1:
							counter = counter - 3;
							printf("Counter is: %d REG @\n", counter);
							break;
						case 2:
							counter = counter - 7;
							printf("Counter is: %d STACK @\n", counter);
							break;
						default:
							return -1;
					}
				}
				break;
			default:
				return -1;
		}
	}
	counter = counter - 8;
	opCodeIndArr[opInd_sz - 1] = counter; /*Should be index of function ID*/
	return 0;
}

/*Converts a binary number to a decimal*/
int bin_to_decimal(unsigned char* bin_buf, size_t length){
	int decimal = 0;
	for(int i = 0; i < length; i++){
		int placevalue = (1<<(length - 1 -i));
		if(bin_buf[i] != 0){
			decimal = decimal + placevalue;
		}
	}
	return decimal;
}

/*Fills the function array with the indexes of the end of each function.
  'F' being the array, F[i] is the index of the function with LABEL 'i'.
  Returns a zero upon success. Otherwise it will return a non-zero integer.*/
int getEndOfFunctionIndex(unsigned char* bin_buf, size_t bin_buf_sz, int* functionIndexes, size_t firstFunc_sz){

	size_t nofFuncINSTR = firstFunc_sz;
	int OPcodeIndArr[nofFuncINSTR+1];
	int result = getOPcodeINDEX(bin_buf, OPcodeIndArr, nofFuncINSTR + 1 ,bin_buf_sz);
	if(result != 0){
		return result;
	}
	size_t func_label = bin_to_decimal(bin_buf + OPcodeIndArr[nofFuncINSTR], 4);
	functionIndexes[func_label] = bin_buf_sz - 1;

	/*Keep looping while function ID is not at beginning of file*/
	while(OPcodeIndArr[nofFuncINSTR] > 8){
		size_t prevFuncID_Index = OPcodeIndArr[nofFuncINSTR];
		nofFuncINSTR = bin_to_decimal(bin_buf + (prevFuncID_Index - 8), 8);
		result = getOPcodeINDEX(bin_buf, OPcodeIndArr, nofFuncINSTR ,functionIndexes[func_label] + 1);
		if(result != 0){
			return result;
		}
		func_label = bin_to_decimal(bin_buf + OPcodeIndArr[nofFuncINSTR], 4);
		functionIndexes[func_label] = prevFuncID_Index - 1;
	}

	return 0;
}


///////*Linked LIST functions.*////////////


struct list* addToFront(struct list* head, struct list* newList){
	newList->next = head;
	return newList;
}

struct list* removeFront(struct list* head){
	struct list* p;

	if(head != NULL){
		p = head;
		head = head->next;
		free(p);
	}

	return head;
}

////*Stack Push and Pop methods adapted to Linked List.*/////

struct list* stackPush(struct list* head, int value, int relative_address){

	struct list* newList = (struct list*)malloc(sizeof(struct list));
	newList->value = value;
	newList->relative_address = relative_address;
	if(head != NULL){
		newList = addToFront(head,newList);
	}
	else{
		newList->next = NULL;
	}
	return newList;
}

struct list* stackPop(struct list* head){
	return removeFront(head);
}

//**		THE CODE FOR THE ASSEMBLY INSTRUNCTIONS		**//

/*	EQU
	Takes a register address and tests if it equals zero,
	the value in the register will be 1 if it is 0, or 0 if it is not.
	The result is stored in the same register.
*/
void equ(size_t registerAddress){
	unsigned char regVal = registers[registerAddress];
	if(regVal == 0){
		registers[registerAddress] = 1;
	}
	else{
		registers[registerAddress] = 0;
	}
	return;
}

/*	NOT
	Takes a register address and performs a bitwise not operation on the value at that address.
	The result is stored in the same register
*/
void not(size_t registerAddress){
	unsigned char regVal = registers[registerAddress];
	regVal = ~regVal;
	registers[registerAddress] = regVal;
	return;
}

/*	AND
	Takes two register addresses and ANDs their values, storing the result in the ﬁrst listed register.
*/
void and(size_t registerAddress1, size_t registerAddress2){
	unsigned char regVal1 = registers[registerAddress1];
	unsigned char regVal2 = registers[registerAddress2];
	regVal1 = regVal1 & regVal2;
	registers[registerAddress1] = regVal1;
	return;
}

/*	ADD
	Takes two register addresses and adds the values, storing the result in the ﬁrst listed register.
*/
void add(size_t registerAddress1, size_t registerAddress2){
	unsigned char regVal1 = registers[registerAddress1];
	unsigned char regVal2 = registers[registerAddress2];
	regVal1 = regVal1 + regVal2;
	registers[registerAddress1] = regVal1;
	return;
}

/*	RET
	Terminates the current function, this is guaranteed
	to always exist at the end of each function.
	There may be more than one RET in a function.
	Sets program counter the next instruction in the calling function.
*/
void ret() {
	struct list* top = stack_pointer;
	struct list* currentStackFrame = stackFramePnters[nofStackFrames - 1];

	//No function stack for some reason.
	if(top == NULL){
		return;
	}

	//Pops all elements in frame, but the first element in frame which contains old program counter value.//
	while(top->relative_address != currentStackFrame->relative_address){
		top = stackPop(top);
	}
	int old_prog_counter = top->value;
	top = stackPop(top);

	program_counter = old_prog_counter + 1;//Point to next instruction in calling func.
	stack_pointer = top;
	stackFramePnters[nofStackFrames - 1] = NULL;
	nofStackFrames--;

	return;

}

/*	POP
	Pops memory from the stack, to be returned to the calling function.
	Your implementation should manage the storage of this value.
*/
void pop(int stackAddress){
	struct list* currentStackFrame = stackFramePnters[nofStackFrames - 1];

	struct list* stackReturnValueSpace = currentStackFrame->next;

	if(stackAddress == 0){
		stackReturnValueSpace->value = currentStackFrame->relative_address;
	}
	else if(stackAddress == 1){
		stackReturnValueSpace->value = stack_pointer->relative_address;
	}
	else if(stackAddress == 2){
		stackReturnValueSpace->value = program_counter;
	}
	else{
		struct list* currStackElem = stack_pointer;

		while(currStackElem->value != -2){
					currStackElem = currStackElem->next;
		}
		size_t eofargs = currStackElem->relative_address;

		if(stackAddress == 3){
				currStackElem = currStackElem->next;
				stackReturnValueSpace->value = currStackElem->value;
		}
		else{
				int position = stackAddress - 3;
				currStackElem = stack_pointer;
				if(currStackElem->value == -2){
					printf("Moving value to non-existant stack space. Error.\n");
					return;
				}
				while(currStackElem->relative_address != (eofargs + position)){
					currStackElem = currStackElem->next;
				}
				stackReturnValueSpace->value = currStackElem->value;
		}
	}

	return;
}

/*	CAL
	Copies arguments from calling function, creates a new function stack frame, and then pastes
	back all the arguments into the new function.
*/
void cal(unsigned char func, int stackAddress){

	//Get number of arguments.
	unsigned char funcID[8];
	bit_copy(&func, funcID, 1);
	int nofArg = bin_to_decimal(funcID + 4, 4);

	//Transfer all arguments to array.
	int* arguments;
	if(nofArg > 0){
		int argz[nofArg];
		arguments = argz;
		//Get to arguments address in stack.
		if(stackAddress != 3){
			printf("The program does not use 0x03 as the arguments address all the time.\n");
			return;
		}
		for(int i = 0; i < nofArg; i++){
			arguments[nofArg - i - 1] = stack_pointer->value;
		}
	}
	else{
		arguments = NULL;
	}

	//Create space for return value;
	stack_pointer = stackPush(stack_pointer, 0, (stack_pointer->relative_address +1));

	//Push the current value of the program counter, to act like a return address.
	stack_pointer = stackPush(stack_pointer, program_counter, (stack_pointer->relative_address +1));

	//Push stack frame pointer onto array of stack frame pointer.
	if(sizeOfStackFrameArray == nofStackFrames){
		sizeOfStackFrameArray = 2*sizeOfStackFrameArray;
		stackFramePnters = (struct list**)realloc(stackFramePnters, sizeof(void*)*sizeOfStackFrameArray);
		stackFramePnters[nofStackFrames] = stack_pointer;
		nofStackFrames++;
	}
	else{
		stackFramePnters[nofStackFrames] = stack_pointer;
		nofStackFrames++;
	}
	//Create place for arguments.
	if(arguments != NULL){
		for(int i = 0; i < nofArg; i++){
			stack_pointer = stackPush(stack_pointer, arguments[i], (stack_pointer->relative_address +1));
		}
	}
	else{
		//Push empty argument slot.
		stack_pointer = stackPush(stack_pointer, 0, (stack_pointer->relative_address +1));
	}
	stack_pointer = stackPush(stack_pointer, -2, (stack_pointer->relative_address +1));//End of arguments section.
	program_counter = 0;
	return;

}

/*	MOV
	 Pushes the value at some point in memory to another point in memory (register or stack).
*/
void mov(int source, int destination, int mode){
	int val1;
	switch (mode){
		case 0: //Register-register
			val1 = registers[source];
			registers[destination] = val1;
			break;
		case 1: //Register-stack
			val1 = registers[source];
				if(destination == 0){
					printf("Attempting to change stack frame pointer. Error.\n");
				}
			    else if(destination == 1){
					printf("Attempting to change stack pointer. Error.\n");
				}
				else if(destination == 2){
					program_counter = val1;
				}
				else{
					//Needs To be re-thought. IDEA: argument section 0x03 may take up multiple elements, but rest of stack frame 0x04, 0x05, ... (if any) are single nodes.
					struct list* currStackElem = stack_pointer;

					while(currStackElem->value != -2){
							currStackElem = currStackElem->next;
						}
					size_t eofargs = currStackElem->relative_address;

					if(destination == 3){
						currStackElem = currStackElem->next;
						currStackElem->value = val1;
					}
					else{
						int position = destination - 3;
						currStackElem = stack_pointer;
						if(currStackElem->value == -2){
							printf("Moving value to non-existant stack space. Error.\n");
							return;
						}
						while(currStackElem->relative_address != (eofargs + position)){
							currStackElem = currStackElem->next;
						}
						currStackElem->value = val1;
					}
				}
			break;
		case 2: //Register-Pointer_Variable
			val1 = registers[source];
				if(destination == 0){
					printf("Attempting to change stack frame pointer. Error.\n");
				}
			    else if(destination == 1){
					stack_pointer->value = val1;
				}
				else if(destination == 2){
					printf("Attempting to use Program counter as an address. Error.\n");
				}
				else{
					printf("Attempting to use local stack variables as addresses. Error.\n");
				}
			break;
		case 3://Stack-Register
				if(source == 0){
					registers[destination] = stackFramePnters[nofStackFrames - 1]->relative_address;
				}
			    else if(source == 1){
					registers[destination] = stack_pointer->relative_address;
				}
				else if(source == 2){
					registers[destination] = program_counter;
				}
				else{
					struct list* currStackElem = stack_pointer;

					while(currStackElem->value != -2){
							currStackElem = currStackElem->next;
						}
					size_t eofargs = currStackElem->relative_address;

					if(source == 3){
						currStackElem = currStackElem->next;
						registers[destination] = currStackElem->value;
					}
					else{
						int position = source - 3;
						currStackElem = stack_pointer;
						if(currStackElem->value == -2){
							printf("Accessing non-existant stack space. Error.\n");
							return;
						}
						while(currStackElem->relative_address != (eofargs + position)){
							currStackElem = currStackElem->next;
						}
						registers[destination] = currStackElem->value;
					}
				}
			break;
		case 4://Stack-Stack
			if(source == 0){
					int r_address = stackFramePnters[nofStackFrames - 1]->relative_address;
					if(destination == 0){
						printf("Attempting to change stack frame pointer. Error.\n");
					}
			    	else if(destination == 1){
						printf("Attempting to change stack pointer. Error.\n");
					}
					else if(destination == 2){
						program_counter = r_address;
					}
					else{
						struct list* currStackElem = stack_pointer;

						while(currStackElem->value != -2){
								currStackElem = currStackElem->next;
							}
						size_t eofargs = currStackElem->relative_address;

						if(destination == 3){
							currStackElem = currStackElem->next;
							currStackElem->value = r_address;
						}
						else{
							int position = destination - 3;
							currStackElem = stack_pointer;
							if(currStackElem->value == -2){
								printf("Accessing non-existant stack space. Error.\n");
								return;
							}
							while(currStackElem->relative_address != (eofargs + position)){
								currStackElem = currStackElem->next;
							}
							currStackElem->value = r_address;
						}
					}
				}
			    else if(source == 1){
					int r_address = stack_pointer->relative_address;
					if(destination == 0){
						printf("Attempting to change stack frame pointer. Error.\n");
					}
			    	else if(destination == 1){
						printf("Attempting to change stack pointer. Error.\n");
					}
					else if(destination == 2){
						program_counter = r_address;
					}
					else{
						struct list* currStackElem = stack_pointer;

						while(currStackElem->value != -2){
								currStackElem = currStackElem->next;
							}
						size_t eofargs = currStackElem->relative_address;

						if(destination == 3){
							currStackElem = currStackElem->next;
							currStackElem->value = r_address;
						}
						else{
							int position = destination - 3;
							currStackElem = stack_pointer;
							if(currStackElem->value == -2){
								printf("Accessing non-existant stack space. Error.\n");
								return;
							}
							while(currStackElem->relative_address != (eofargs + position)){
								currStackElem = currStackElem->next;
							}
							currStackElem->value = r_address;
						}
					}
				}
				else if(source == 2){
					int counter = program_counter;
					if(destination == 0){
						printf("Attempting to change stack frame pointer. Error.\n");
					}
			    	else if(destination == 1){
						printf("Attempting to change stack pointer. Error.\n");
					}
					else if(destination == 2){
						program_counter = counter;
					}
					else{
						struct list* currStackElem = stack_pointer;

						while(currStackElem->value != -2){
								currStackElem = currStackElem->next;
							}
						size_t eofargs = currStackElem->relative_address;

						if(destination == 3){
							currStackElem = currStackElem->next;
							currStackElem->value = counter;
						}
						else{
							int position = destination - 3;
							currStackElem = stack_pointer;
							if(currStackElem->value == -2){
								printf("Accessing non-existant stack space. Error.\n");
								return;
							}
							while(currStackElem->relative_address != (eofargs + position)){
								currStackElem = currStackElem->next;
							}
							currStackElem->value = counter;
						}
					}
				}
				else{
						struct list* currStackElem = stack_pointer;

						while(currStackElem->value != -2){
								currStackElem = currStackElem->next;
							}
						size_t eofargs = currStackElem->relative_address;

						if(source == 3){
							currStackElem = currStackElem->next;
						}
						else{
							int position = source - 3;
							currStackElem = stack_pointer;
							if(currStackElem->value == -2){
								printf("Accessing non-existant stack space. Error.\n");
								return;
							}
							while(currStackElem->relative_address != (eofargs + position)){
								currStackElem = currStackElem->next;
							}
						}
					int val1 = currStackElem->value;

					if(source == 0){
						printf("Attempting to change stack frame pointer. Error.\n");
					}
			    	else if(source == 1){
						printf("Attempting to change stack pointer. Error.\n");
					}
					else if(source == 2){
						program_counter = val1;
					}
					else{
						currStackElem = stack_pointer;

						while(currStackElem->value != -2){
								currStackElem = currStackElem->next;
							}
						size_t eofargs = currStackElem->relative_address;

						if(destination == 3){
							currStackElem = currStackElem->next;
							currStackElem->value = val1;
						}
						else{
							int position = destination - 3;
							currStackElem = stack_pointer;
							if(currStackElem->value == -2){
								printf("Accessing non-existant stack space. Error.\n");
								return;
							}
							while(currStackElem->relative_address != (eofargs + position)){
								currStackElem = currStackElem->next;
							}
							currStackElem->value = val1;
						}
					}
				}
			break;
		case 5://Stack-Pointer_Variable
			if(source == 0){
					int r_address = stackFramePnters[nofStackFrames - 1]->relative_address;
					if(destination == 0){
						printf("Attempting to change stack frame pointer. Error.\n");
					}
			    	else if(destination == 1){
						stack_pointer->value = r_address;
					}
					else if(destination == 2){
						printf("Attempting to change Program Counter. Error.\n");
					}
				}
			    else if(source == 1){
					int r_address = stack_pointer->relative_address;
					if(destination == 0){
						printf("Attempting to change stack frame pointer. Error.\n");
					}
			    	else if(destination == 1){
						stack_pointer->value = r_address;
					}
					else if(destination == 2){
						printf("Attempting to change Program Counter. Error.\n");
					}
				}
				else if(source == 2){
					int counter = program_counter;
					if(destination == 0){
						printf("Attempting to change stack frame pointer. Error.\n");
					}
			    	else if(destination == 1){
						stack_pointer->value = counter;
					}
					else if(destination == 2){
						printf("Attempting to change Program Counter. Error.\n");
					}
				}
				else{
						int val1;
						struct list* currStackElem = stack_pointer;

						while(currStackElem->value != -2){
								currStackElem = currStackElem->next;
							}
						size_t eofargs = currStackElem->relative_address;

						if(source == 3){
							currStackElem = currStackElem->next;
							val1 = currStackElem->value;
						}
						else{
							int position = source - 3;
							currStackElem = stack_pointer;
							if(currStackElem->value == -2){
								printf("Accessing non-existant stack space. Error.\n");
								return;
							}
							while(currStackElem->relative_address != (eofargs + position)){
								currStackElem = currStackElem->next;
							}
							val1 = currStackElem->value;
						}
					if(destination == 0){
						printf("Attempting to change stack frame pointer. Error.\n");
					}
			    	else if(destination == 1){
						stack_pointer->value = val1;
					}
					else if(destination == 2){
						printf("Attempting to change Program Counter. Error.\n");
					}
				}
			break;
		case 6://Value-Register
			val1 = source;
			registers[destination] = val1;
			break;
		case 7://Value-Stack
			val1 = source;
			if(destination == 0){
				printf("Attempting to change stack frame pointer. Error.\n");
			}
			else if(destination == 1){
				printf("Attempting to change stack pointer. Error.\n");
			}
			else if(destination == 2){
				size_t val = val1;
				program_counter = val;
			}
			else{
					struct list* currStackElem = stack_pointer;

					while(currStackElem->value != -2){
							currStackElem = currStackElem->next;
						}
					size_t eofargs = currStackElem->relative_address;

					if(destination == 3){
						currStackElem = currStackElem->next;
						currStackElem->value = val1;
					}
					else{
						int position = destination - 3;
						currStackElem = stack_pointer;
						if(currStackElem->value == -2){
							printf("Accessing non-existant stack space. Error.\n");
							return;
						}
						while(currStackElem->relative_address != (eofargs + position)){
							currStackElem = currStackElem->next;
						}
						currStackElem->value = val1;
					}
			}
			break;
		case 8://Value-Pointer_variable
			val1 = source;
			if(destination == 0){
				printf("Attempting to change stack frame pointer. Error.\n");
			}
			else if(destination == 1){
				size_t val = val1;
				stack_pointer->value = val;
			}
			else if(destination == 2){
				printf("Attempting to change Program Counter. Error.\n");
			}
			break;
		default:
			return;
	}
	return;
}

/*Returns 0 if all instructions are executed properly,
  otherwise it returns the index of the instruction that first failed.*/
int executeInstructions(unsigned char* bin_buf, int* OPcodeIndexes, size_t binbuf_sz, size_t opcd_sz, int* funcIndexes){
	/*Some variable initialisations*/
	int type = -1;
	int registerAddress1 = -1;
	int registerAddress2 = -1;
	int stackAddress1 = -1;
	int stackAddress2 = -1;
	int pointerVariable = -1;
	int value = -1;

	/*Setting up things after a call*/
	if(OPcodeIndexes == NULL){
				int funcInd = bin_to_decimal(bin_buf + opcd_sz, 4);
				int funcBinBufInd = funcIndexes[funcInd];
				int opcd_sz = bin_to_decimal(bin_buf + (funcBinBufInd-7), 8) + 1;
				int funcOpCodInd[opcd_sz];

				//Get operation code indexes in new function.
				int result = getOPcodeINDEX(bin_buf,funcOpCodInd,opcd_sz,binbuf_sz);
				if(result != 0){
					printf("The Intructions are not valid.\n");
					return 1;
				}
				OPcodeIndexes = funcOpCodInd;
	}
	for(; program_counter < opcd_sz-1; program_counter++){
		if(stack_pointer->relative_address > 127){
			printf("Stack overflow!!\n");
			return -1;
		}
		int i = program_counter;

		int position = OPcodeIndexes[i];
		int opcode = determineOPcode(bin_buf + position);
		switch(opcode){
			case 7:
				position = position - 2;
				type = determineType(bin_buf + position);
				if(type != 1){
					return OPcodeIndexes[i];
				}
				position = position - 3;
				registerAddress1 = bin_to_decimal(bin_buf + position, 3);
				/*FUNCTION CALL*/
				printf("EQU\n");
				equ(registerAddress1);
				break;
			case 6:
				position = position- 2;
				type = determineType(bin_buf + position);
				if(type != 1){
					return OPcodeIndexes[i];
				}
				position = position - 3;
				registerAddress1 = bin_to_decimal(bin_buf + position, 3);
				/*FUNCTION CALL*/
				printf("NOT\n");
				not(registerAddress1);
				break;
			case 5:
				position = position - 2;
				type = determineType(bin_buf + position);
				if(type != 1){
					return OPcodeIndexes[i];
				}
				position = position - 3;
				registerAddress1 = bin_to_decimal(bin_buf + position, 3);

				position = position -2;
				type = determineType(bin_buf + position);
				if(type != 1){
					return OPcodeIndexes[i];
				}
				position = position - 3;
				registerAddress2 = bin_to_decimal(bin_buf + position, 3);
				/*FUNCTION CALL*/
				printf("AND\n");
				and(registerAddress2, registerAddress1);
				break;
			case 4:
				position = position - 2;
				type = determineType(bin_buf + position);
				if(type != 1){
					return OPcodeIndexes[i];
				}
				position = position - 3;
				registerAddress1 = bin_to_decimal(bin_buf + position, 3);

				position = position -2;
				type = determineType(bin_buf + position);
				if(type != 1){
					return OPcodeIndexes[i];
				}
				position = position - 3;
				registerAddress2 = bin_to_decimal(bin_buf + position, 3);
				/*FUNCTION CALL*/
				printf("ADD\n");
				add(registerAddress2, registerAddress1);
				break;
			case 3:
				/*FUNCTION CALL*/
				printf("RET\n");
				ret();
				break;
			case 2:
				position = position - 2;
				type = determineType(bin_buf + position);
				if(type != 2){
					return OPcodeIndexes[i];
				}
				position = position - 7;
				stackAddress1 = bin_to_decimal(bin_buf + position,7);
				/*FUNCTION CALL*/
				printf("POP\n");
				pop(stackAddress1);
				break;
			case 1:
				position = position - 2;
				type = determineType(bin_buf + position);
				if(type != 0){
					return OPcodeIndexes[i];
				}
				value = bin_to_decimal(bin_buf + OPcodeIndexes[opcd_sz - 1], 8);

				position = position - 2;
				type = determineType(bin_buf + position);
				if(type != 2){
					return OPcodeIndexes[i];
				}
				position = position - 7;
				stackAddress1 = bin_to_decimal(bin_buf + position, 7);
				/*FUNCTION CALL*/
				printf("CAL\n");
				cal(value,stackAddress1);

				//Start executing new function.
				int result = executeInstructions(bin_buf, NULL, binbuf_sz, OPcodeIndexes[opcd_sz - 1],funcIndexes);
				if(result != 0){
					printf("Instruction with index %d could not be properly executed.\n", result);
				}

				break;
			case 0:
				position = position -2;
				type = determineType(bin_buf + position);
				switch(type){
					case 1:
						position = position - 3;
						registerAddress1 = bin_to_decimal(bin_buf + position, 3);

						position = position - 2;
						type = determineType(bin_buf + position);
						switch(type){
							case 0:
								position = position - 8;
								value = bin_to_decimal(bin_buf + position,8);
								/*FUNCTION CALL*/
								printf("MOV	VAL->REG\n");
								mov(value,registerAddress1, 6);
								break;
							case 1:
								position = position - 3;
								registerAddress2 = bin_to_decimal(bin_buf + position, 3);
								/*FUNCTION CALL*/
								printf("MOV REG->REG\n");
								mov(registerAddress2, registerAddress1, 0);
								break;
							case 2:
								position = position - 7;
								stackAddress1 = bin_to_decimal(bin_buf + position, 7);
								/*FUNCTION CALL*/
								printf("MOV STACK->REG\n");
								mov(stackAddress1, registerAddress1, 3);
								break;
							default:
								return OPcodeIndexes[i];
						}
						break;
					case 2:
						position = position - 7;
						stackAddress1 = bin_to_decimal(bin_buf + position, 7);

						position = position - 2;
						type = determineType(bin_buf + position);
						switch(type){
							case 0:
								position = position - 8;
								value = bin_to_decimal(bin_buf + position,8);
								/*FUNCTION CALL*/
								printf("MOV VAL->STACK\n");
								mov(value,stackAddress1, 7);
								break;
							case 1:
								position = position - 3;
								registerAddress2 = bin_to_decimal(bin_buf + position, 3);
								/*FUNCTION CALL*/
								printf("MOV REG->STACK\n");
								mov(registerAddress2, stackAddress1, 1);
								break;
							case 2:
								position = position - 7;
								stackAddress2 = bin_to_decimal(bin_buf + position, 7);
								/*FUNCTION CALL*/
								printf("MOV STACK->STACK\n");
								mov(stackAddress2,stackAddress1, 4);
								break;
							default:
								return OPcodeIndexes[i];
						}
						break;
					case 3:
						position = position - 7;
						pointerVariable = bin_to_decimal(bin_buf + position, 7);

						position = position - 2;
						type = determineType(bin_buf + position);
						switch(type){
							case 0:
								position = position - 8;
								value = bin_to_decimal(bin_buf + position,8);
								/*FUNCTION CALL*/
								printf("MOV VAL->PNTER\n");
								mov(value,pointerVariable,8);
								break;
							case 1:
								position = position - 3;
								registerAddress2 = bin_to_decimal(bin_buf + position, 3);
								/*FUNCTION CALL*/
								printf("MOV REG->PNTER\n");
								mov(registerAddress2, pointerVariable, 2);
								break;
							case 2:
								position = position - 7;
								stackAddress2 = bin_to_decimal(bin_buf + position, 7);
								/*FUNCTION CALL*/
								printf("MOV STACK->PNTER\n");
								mov(stackAddress2, pointerVariable, 5);
								break;
							default:
								return OPcodeIndexes[i];
						}
						break;
					default:
						return OPcodeIndexes[i];
				}

				break;
			default:
				return OPcodeIndexes[i];
		}
	}
	return 0;
}

void printProgramData(){
	printf("The prog counter is: %lu\n", program_counter);
	if(stack_pointer != NULL){
		printf("The stack pointer is %lu\n", stack_pointer->relative_address);
	} else{
		printf("The stack pointer is NULL.\n");
	}
	printf("Size of stack frame array: %d\n", sizeOfStackFrameArray);
	printf("The number of stack frames is: %d\n", nofStackFrames);
	if(nofStackFrames > 0){
		printf("The stack frame pointer is at: %lu\n", stackFramePnters[nofStackFrames - 1]->relative_address);
	}
	else{
		printf("The stack frame pointer is NULL\n");
	}
}
int main(int argc, char** argv) {

	/*Open file*/
	const char* path = argv[1];
	FILE* file_exec = fopen(path, "rb");

	/*Get the File size*/
	size_t size = getFileSize(file_exec);

	/*Put all File byte data into array*/
	unsigned char binary[size];
	size_t read = fread(binary, 1, size, file_exec);
	if(read != size){
		printf("File copy into array failed.");
		return 1;
	}

	/*Close file when done reading from it.*/
	fclose(file_exec);

	/*Start to restructure bits into easily executable form.*/
	size_t bufferSZ = (size-2)*8;
	unsigned char binarybuffer[bufferSZ];
	bit_copy(binarybuffer, binary, size-2);/*Initialises binaryBuffer with char version of bits stored in binary array*/

	/*Test binarybuffer again[PASS]
	for(int i = 0; i<bufferSZ; i++){
		printf("%d",binarybuffer[i]);
	}
	printf("\n");*/

	/*Test determine OP code and type.[PASS]
	unsigned char a[2] = {1,0};
	printf("Type for last instruction is: %d\n", determineType(binarybuffer + (bufferSZ - 8)));
	*/

	/*Get array of functions in the file.[PASS]*/
	printf("Compiling Functions.\n");
	size_t nofFUNC = 16;
	size_t nofINSTRforFirstFUNC = binary[size - 2]; /*Last byte is new line*/
	int functionIndexes[nofFUNC];
	int result = getEndOfFunctionIndex(binarybuffer,bufferSZ,functionIndexes, nofINSTRforFirstFUNC);
	if(result != 0){
		printf("Error with the given functions.\n");
		return 1;
	}

	/*Get array of operation code indexes for the main function.[PASS]*/
	printf("preparing main for execution.\n");
	int mainFUNC = functionIndexes[0] + 1;/*Add one to make index arithmetic more natural.*/
	int nofMainINSTR;

	if(mainFUNC == bufferSZ){
		nofMainINSTR = nofINSTRforFirstFUNC;
	}
	else{
		nofMainINSTR = bin_to_decimal(binarybuffer + (mainFUNC - 8), 8);
	}

	int opCodeIndArr[nofMainINSTR+1];
	result = getOPcodeINDEX(binarybuffer,opCodeIndArr,nofMainINSTR+1,bufferSZ);
	if(result != 0){
		printf("The Intructions are not valid.\n");
		return 1;
	}

	//Return space for Main.//
	stack_pointer = stackPush(NULL, -1, 0);

	//The stack frame for main.
	stack_pointer = stackPush(stack_pointer, -1, 1);
	struct list* mainStackFrame = stack_pointer;
	stackFramePnters = (struct list**)malloc(sizeof(void*)*16);
	stackFramePnters[0] = mainStackFrame;
	nofStackFrames++;
	sizeOfStackFrameArray = 16;

	stack_pointer = stackPush(stack_pointer, 0, 2);
	stack_pointer = stackPush(stack_pointer, -2, 3);//Value -2 means end of argument section.



	/*Test by printing out OP indexes[PASS}
	printf("The indexes for OP codes are: \n");
	for(int v = 0; v < nofINSTR+1; v++){
		printf("%d ", opCodeIndArr[v]);
	}
	*/

	/*Testing Linked List Stack[PASS]
	struct list* mylist = stack_pointer;
	struct list* cursor = mylist;
	while(cursor->next != NULL){
		printf("Node with R@: %lu, Value is: %d\n", cursor->relative_address, cursor->value);
		cursor = cursor->next;
	}
	printf("Node with R@: %lu, Value is: %d\n", cursor->relative_address, cursor->value);

	cursor = mylist;
	while(cursor->next != NULL){
		mylist = mylist->next;
		stackPop(cursor);
		cursor = mylist;
	}
	printf("All stacks but first were deleted. %d %d %lu\n", mylist->value, mylist->relative_address, mylist->next);
	*/

	/*Printing static variable information
	stack_pointer = stackPush(stack_pointer, 120, (stack_pointer->relative_address) + 1);
	printProgramData();
	printf("\n\n");
	int source = 0;
	int destination = 2;
	registers[source] = 0;
	registers[destination] = 255;
	and(0,2);
	mov(source, 3, 1);
	pop(3);
	//printf("The register at destination has: %d\n", registers[destination]);
	//printf("The value at stack address %d is: %d\n", destination, (stack_pointer->next)->value);
	//printf("The value at the address pointed to by sp is: %d\n", stack_pointer->value);
	printf("The main return value is: %d\n", (stackFramePnters[0]->next)->value);
	stack_pointer = stackPop(stack_pointer);
	printProgramData();
	printf("\n\n");
	*/


	/*Executing instructions within function.[PASS]*/
	printf("Executing main...\n");
	result = executeInstructions(binarybuffer, opCodeIndArr, bufferSZ, nofMainINSTR+1,functionIndexes);
	if(result != 0){
		printf("Instruction with index %d could not be properly executed.\n", result);
	}

	//Preventing memory leaks.
	free(stackFramePnters);

	struct list* cursor = stack_pointer;
	while(stack_pointer != NULL){
		stack_pointer = stack_pointer->next;
		free(cursor);
		cursor = stack_pointer;
	}

}


///////								////////
///////		TESTING CHECK LIST		////////
///////								////////
/*
			Ret [PASS]
			Cal [PASS]
			MOV [PASS]
			POP	[PASS]
			AND [PASS]
			ADD [PASS]
			EQU [PASS]
			NOT [PASS]

*/

//NOW I CAN ENTER INTEGRATION PHASE

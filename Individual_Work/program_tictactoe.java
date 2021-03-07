import java.util.Scanner;

/* I might need to make my own methods.
   If I do so, I will make one to determine
   if there are 3 (o's or x's) in a row/column/diagnol, and
   anther one to place the x and o on a grid.
   Call them: hasWon and setPosition. */

public class TicTacToe {
	public static int [] getx_y (int w){
		Scanner scan = new Scanner(System.in);
		int [] ar = new int[] {0, 0};
		if (!(hasWon(w))){
			int x = scan.nextInt();
			int y = scan.nextInt();
			int [] xy = new int [2];
			xy[0] = x;
			xy[1] = y;
			return xy;
		}
		return ar;
	}
	public static void main(String[] args){
		int win = 0;
		int turn = 0;
		StringBuilder row0 = new StringBuilder(" | | ");
		StringBuilder row1 =new StringBuilder(" | | ");
		StringBuilder row2 =new StringBuilder(" | | ");
		while (!(hasWon(win))){
			int [] x_y = getx_y(win);
			int x = x_y[0];
			int y = x_y[1];
			String [] position = getPosition(x, y);
			String game_out = setPosition(position[0], position[1], row0, row1, row2, (turn + ""));
			win = win + didtheyWin(row0, row1, row2);
			System.out.printf("\n");
			System.out.println(game_out);
				if (turn == 0){
					turn++;
				}
				else if (turn == 1){
					turn--;
				}
		}
	}
	
	public static boolean hasWon (int win_var){
		if (win_var <= 0){
			return false;
		}
		else if (win_var > 0){
			return true;
		}
		return true;
	}
		
	public static String [] getPosition (int x1,int y1){
		String [] pos = new String[2];
		pos[0] = "" + x1;
		pos[1] = "row" + y1;
		return pos;
	}
		
	public static String setPosition (String p0,String p1,StringBuilder r0,StringBuilder r1, StringBuilder r2, String tr){
		String row = "";
		int pO = Integer.parseInt(p0);
		if (pO == 1){
			pO += 1;
		}
		else if (pO == 2){
			pO += 2;
		}
		for (int i = 0; i<3; i++){
			if (p1.equals("row"+i)){
				row = row + "r"+i;
				break;
			}
		}
		if (tr.equals("0")){
			if (row.equals("r0")){
				r0.replace(pO, pO+1, "X");
			}
			else if (row.equals("r1")){
				r1.replace(pO, pO+1, "X");
			}
			else {
				r2.replace(pO, pO+1, "X");
			}
		}
		else {
			if (row.equals("r0")){
				r0.replace(pO, pO+1, "O");
			}
			else if (row.equals("r1")){
				r1.replace(pO, pO+1, "O");
			}
			else {
				r2.replace(pO, pO+1, "O");
			}
		}
			String gameO = (r0 +"\n" + "-----\n" +
						   r1 + "\n" + "-----\n" +
						   r2 + "\n");
			return gameO;
	}
	public static int didtheyWin(StringBuilder r0, StringBuilder r1, StringBuilder r2){
		String [] rows = new String[15];
			for (int i= 0; i< 15; i+= 1){
				if(i< 5){
					rows[i]= r0.charAt(i) + "";
				}
				else if (i< 10){
					rows[i]= r1.charAt(i - 5) + "";
				}
				else{
					rows[i]= r2.charAt(i - 10) + "";
				}
			}
			for (int i = 0; i < 5; i += 2){
				int v = i + 5;
				int t = i + 10;
				if ( (rows[i].equals(rows[i+5])&&(rows[i].equals(rows[i+10]))&&!(rows[i].equals(" ")))) {
					System.out.println(rows[i] + " wins!");
					return 1;
				}
				else if (i==0){
					for (int m = 0; m <= 10; m+= 5){
						if (!rows[m].equals(" ")){
							if(rows[m].equals(rows[m+2])&& rows[m].equals(rows[m+4])){
								System.out.println(rows[m] + " wins!");
								return 1; 
							}
						}
					}
				} 
				else { 
					if ( (i==0)||(i==4)){
							if ((rows[i].equals(rows[7])&&(rows[i].equals(rows[14])||(rows[i].equals(rows[10])))&&!(rows[i].equals(" ")))){
								System.out.println(rows[i] + " wins!");
								return 1;
							}																	
					}
				}																				
			continue;																	}
	return 0;
	} 
}
import java.util.*;
/*
 * This class is the one you need to complete. Only the member variables
 * and constructor have been implemented for you.
 */
public class LinkedPositionalList<E> implements PositionalList<E>, Iterable<E>  {
	
	/*
	 * This nested class contains a completed implementation of Position
	 * which you should use within LinkedPositionalList.
	 * 
	 * You do not need to edit this class.
	 */
	private class Node<E> implements Position<E> {
		
		private Node<E> prev;
		private Node<E> next;
		private E element;
		
		public Node(E element) {
			this.element = element;
			this.prev = null;
			this.next = null;
		}
		
		public Node<E> getPrev() {return prev;}
		public Node<E> getNext() {return next;}
		public E getElement() {return element;}
		public void setPrev(Node<E> prev) {this.prev = prev;}
		public void setNext(Node<E> next) {this.next= next;}
		public void setElement(E element) {this.element = element;}
	}
	
	//The header sentinel
	private Node<E> header;

	//The trailer sentinel
	private Node<E> trailer;

	//The number of positions in the list, not counting sentinels
	int size;

	//This constructor creates an empty list
	public LinkedPositionalList() {
		header = new Node<E>(null);
		trailer = new Node<E>(null);
		header.setNext(trailer);
		trailer.setPrev(header);
		size = 0;
	}

	//TODO: You will need to implement the remaining methods!

	@Override
	public int size() {
		// TODO Implement this.
		
		return size;
	}

	@Override
	public boolean isEmpty() {
		// TODO Implement this.
		if( size == 0){
			return true;
		}
		else {
			return false;
		}
	}	

	@Override
	public Position<E> first() {
		// TODO Implement this.
		if (this.isEmpty()){
			return null;
		}
		else {
			return header.getNext() ;
		}
	}

	@Override
	public Position<E> last() {
		// TODO Implement this.
		if(this.isEmpty()){
			return null;
		}
		else {
			return trailer.getPrev();
		}
	}

	@Override
	public Position<E> before(Position<E> p) {
		// TODO Implement this.
		if (isEmpty()){
			return null;
		}
		else if (((Node<E>)p).getPrev() == header){
			return null;
		}
		return ((Node<E>)p).getPrev();
		//return (Position<E>)((Node<E>)p).getNext();
	}

	@Override
	public Position<E> after(Position<E> p) {
		// TODO Implement this.
		if (isEmpty()){
			return null;
		}
		else if (((Node<E>)p).getNext()==trailer){
			return null;
		}
		else {
			return ((Node<E>)p).getNext();
			//return (Position<E>)((Node<E>)p).getNext();
		}
	}

	@Override
	public Position<E> addFirst(E e) {
		// TODO Implement this.
		Node<E> n = new Node<E>(e);
		n.setPrev(header);
		n.setNext(header.getNext());
		
		header.getNext().setPrev(n);
		header.setNext(n);
		
		size++;
		return n;
	}

	@Override
	public Position<E> addLast(E e) {
		// TODO Implement this.
		Node<E> n = new Node<E>(e);
		n.setNext(trailer);
		n.setPrev(trailer.getPrev());
		
		trailer.getPrev().setNext(n);
		trailer.setPrev(n);
		size++;
		return n;
	}

	@Override
	public Position<E> addBefore(Position<E> p, E e) {
		// TODO Implement this.
		Node<E> n = new Node<E>(e);
		Node<E> pnode = (Node<E>)p;
		
		n.setNext(pnode);
		n.setPrev(pnode.getPrev());
		
		pnode.getPrev().setNext(n);
		pnode.setPrev(n);
		size++;
		return n;
	}

	@Override
	public Position<E> addAfter(Position<E> p, E e) {
		// TODO Implement this.
		if(((Node<E>)p).getNext() == trailer.getPrev()){
			return null;
		}
		Node<E> n = new Node<E>(e);
		Node<E> pnode = (Node<E>)p;
		
		n.setNext(pnode.getNext());
		n.setPrev(pnode);
		
		pnode.getNext().setPrev(n);
		pnode.setNext(n);
		
		size++;
		return n;
	}

	@Override
	public E set(Position<E> p, E e) {
		// TODO Implement this.
		
		Node<E> pnode = (Node<E>)p;
		E elem = pnode.getElement();
		pnode.setElement(e);
		
		return elem;
		
	}

	@Override
	public E remove(Position<E> p) {
		// TODO Implement this.
		Node<E> pnode = (Node<E>)p;
		E remE = pnode.getElement();
		pnode.getPrev().setNext(pnode.getNext());
		pnode.getNext().setPrev(pnode.getPrev());
		
		pnode.setNext(null);
		pnode.setPrev(null);
		
		return remE;
	}

	@Override
	public Iterator<E> iterator() {
		// TODO Auto-generated method stub
		return new PositionalListIterator<E>(this, this.first());
	}
		
}
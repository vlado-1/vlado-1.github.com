import static org.junit.Assert.*;

import org.junit.Test;

public class BstSimpleSortedMapTest {

	@Test
	public void testOneNodeBST() {
		BstSimpleSortedMap map = new BstSimpleSortedMap();
		String retVal = map.remove(new Integer(21));
		assertEquals(null, retVal);
		
		BstSimpleSortedMap smap = new BstSimpleSortedMap(1,"I");
		String retVal2 = smap.remove(new Integer(1));
		assertEquals("I", retVal2);
		assertEquals(0, smap.size());
		assertEquals(null,smap.get(1));
	}
	
	@Test
	public void testTwoNodesBST() {
		BstSimpleSortedMap smap = new BstSimpleSortedMap(1,"I");
		smap.put(new Integer(2), "A");
		String retVal = smap.remove(new Integer(2));
		assertEquals("A", retVal);
		assertEquals(1, smap.size());
		assertEquals(null, smap.get(2));
	}
	
	@Test
	public void testTwoChildCaseBST(){
		BstSimpleSortedMap smap = new BstSimpleSortedMap(2,"I");
		smap.put(new Integer(3), "A");
		smap.put(1, "J");
		String retVal = smap.remove(new Integer(2));
		assertEquals("I", retVal);
		assertEquals(2, smap.size());
		assertEquals(null, smap.get(new Integer(2)));
	}
	
	@Test
	public void testTwoChildCase2BST() {
		BstSimpleSortedMap smap = new BstSimpleSortedMap(2,"I");
		smap.put(new Integer(3), "A");
		smap.put(1, "J");
		smap.put(new Integer(7), "B");
		smap.put(new Integer(6), "C");
		smap.put(new Integer(8), "D");
		String retVal = smap.remove(7);
		assertEquals(5, smap.size());
		assertEquals("D", smap.get(8));
		smap.inOrder(smap.root());
		String retVal2 = smap.remove(2);
		smap.inOrder(smap.root());
		
	}
	
	@Test
	public void testSceweredTree() {
		BstSimpleSortedMap smap = new BstSimpleSortedMap(2,"B");
		smap.put(3, "C");
		smap.put(4, "D");
		smap.put(5, "E");
		smap.put(6, "F");
		smap.put(7, "G");
		String retVal = smap.remove(new Integer(5));
		assertEquals(5, smap.size());
		assertEquals(null, smap.get(5));
		smap.inOrder(smap.root());
		
	}

}

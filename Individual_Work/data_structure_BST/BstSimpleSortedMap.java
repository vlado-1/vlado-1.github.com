public class BstSimpleSortedMap implements SimpleSortedMap {

  private class MySimpleEntry implements SimpleEntry {

    private final Integer key;
    private final String value;
    private MySimpleEntry left;
    private MySimpleEntry right;
    private MySimpleEntry parent;

    MySimpleEntry(Integer key, String value) {
      this.key = key;
      this.value = value;
      this.left = null;
      this.right = null;
      this.parent = null;
    }

    @Override
    public Integer getKey() { return key; }

    @Override
    public String getValue() { return value; }

    protected MySimpleEntry getLeft() { return left; }
    protected MySimpleEntry getRight() { return right; }
    protected MySimpleEntry getParent() { return parent; }

    protected void setLeft(MySimpleEntry entry) { left = entry; }
    protected void setRight(MySimpleEntry entry) { right = entry; }
    protected void setParent(MySimpleEntry entry) { parent = entry; }
  }

  private int size;
  private MySimpleEntry root;

  public BstSimpleSortedMap() {
    size = 0;
    root = null;
  }
  public BstSimpleSortedMap(Integer k, String v) {
	 size = 1;
	 MySimpleEntry entry = new MySimpleEntry(k, v);
	 root = entry;
  }

  // attaches the subtree rooted at 'child', to the parent
  private void attachLeft(MySimpleEntry parent, MySimpleEntry child) {
    if(child != null) { child.setParent(parent); }
    if(parent != null) { parent.setLeft(child); }
  }

  // attaches the subtree rooted at 'child', to the parent
  private void attachRight(MySimpleEntry parent, MySimpleEntry child) {
    if(child != null) { child.setParent(parent); }
    if(parent != null) { parent.setRight(child); }
  }

  //////////////////////////
  // Map ADT methods:
  //////////////////////////

  //My method
  public MySimpleEntry root(){
	  return root;
  }
  
  @Override
  public int size() {
    return size;
  }

  @Override
  public boolean isEmpty() {
    return size() == 0;
  }

  @Override
  public String get(Integer k) {
    return get(k, root);
  }

  private String get(Integer k, MySimpleEntry subtreeRoot) {
	// base case: empty subtree
			if(subtreeRoot == null) {
				// k isn't in this subtree
				return null;
			}
			
			// base case: k matches the key in the current entry
	    if(k.compareTo(subtreeRoot.getKey()) == 0) {
	      // TODO: return the value
	      return subtreeRoot.getValue();
	    }
	    // recursive case: k < the current entry
	    else if(k.compareTo(subtreeRoot.getKey()) < 0) {
	      // TODO: return the result of recursing to the left
	      return get(k, subtreeRoot.getLeft());
	    }
	    // recursive case: k > the current entry
	    else {
	      // TODO: return the result of recursing to the right
	      return get(k, subtreeRoot.getRight());
	    }
  }

  @Override
  public String put(Integer k, String v) {
    // We will implement this recursively.

    // If the key already exists, we will need to return the old value
    String oldValue = get(k);

    // Replace the subtree rooted at 'root' with
    // the resulting subtree after doing the put
    root = put(k, v, root);

    return oldValue;
  }

  // Recursive helper method for put
  // Returns the subtree rooted at entry after performing the put
  private MySimpleEntry put(Integer k, String v, MySimpleEntry subtreeRoot) {
	// base case: the key wasn't in the subtree
			if(subtreeRoot == null) {
	      // we have reached a null subtree, where k should be
	      //TODO: create a new entry
	    	MySimpleEntry entry = new MySimpleEntry(k,v);
	      //TODO: increment the size variable
	    	size++;
	      //TODO: return the new entry
	      return entry;
	    }

	    // base case: k matches the one in the current entry
	    if(k.compareTo(subtreeRoot.getKey()) == 0) {
	      // TODO: create a new entry
	    	MySimpleEntry entry = new MySimpleEntry(k,v);
	      // TODO: attachLeft the left child of the current entry to it
	    	attachLeft(entry, subtreeRoot.getLeft());
	      // TODO: attachRight the right child of the current entry to it
	    	attachRight(entry, subtreeRoot.getRight());
	      // TODO: return the new subtree
	      return entry;
	    }
	    // recursive case: k < the current entry
	    else if(k.compareTo(subtreeRoot.getKey()) < 0) {
	      // TODO: get the subtree resulting from recursing left
	    	MySimpleEntry entry = put(k,v, subtreeRoot.getLeft());
	      // TODO: attach that subtree to the current entry
	    	attachLeft(subtreeRoot, entry);
	      // TODO: return the modified entry
	      return subtreeRoot;
	    }
	    // recursive case: k > the current entry
	    else {
	      // TODO: get the subtree resulting from recursing right
	    	MySimpleEntry entry = put(k,v, subtreeRoot.getRight());
	      // TODO: attach that subtree to the current entry
	    	attachRight(subtreeRoot, entry);
	      // TODO: return the modified entry
	      return subtreeRoot;
	    }
  }

  @Override
  public String remove(Integer k) {
    // TODO implement this in exercise 2
    // Implement it recursively.
	//TODO replace this with your implementation of this class from the put/get exercise
	//MySimpleEntry stringEnt = root;
	if (root == null){
		return null;
	}
	String remString = get(k);
	MySimpleEntry entry = removeSubtree(k, root);
	return remString;
  }
  
  public MySimpleEntry removeSubtree(Integer k, MySimpleEntry subtree){

	  //Base case: returns null when the key does not exist.
	  	if (k.compareTo(subtree.getKey()) > 0 && subtree.getRight() == null){
	  		return null;
	  	}
	  	if(k.compareTo(subtree.getKey())< 0 && subtree.getLeft() == null){
	  		return null;
	  	}
	  	
	  	
	  //The Key is found.
	  	if (k.compareTo(subtree.getKey())==0){
	  		
	  		//Base case: The position has no children, in which case the subtree becomes empty.
	  	  	if (subtree.getLeft() == null && subtree.getRight() == null){
	  	  		if (size() > 1){
	  	  			if (subtree.getParent().getRight() == subtree){
	  	  				subtree.getParent().setRight(null);
	  	  			}
	  	  			else {
	  	  				subtree.getParent().setLeft(null);
	  	  			}
	  	  		}
	  	  		else {
	  	  			root = null;
	  	  		}
	  	  		size--;
		  		return null;
		  	}
	  		
	  		//The position has one child, in which case we return the subtree rooted at that child.
	  	  	else if (subtree.getLeft() == null || subtree.getRight() == null){
	  			if (subtree.getLeft() != null){
	  				//attachLeft(subtree.getParent(), subtree.getLeft());
	  				size--;
	  				return subtree.getLeft();
	  			}
	  			else {
	  				//attachRight(subtree.getParent(), subtree.getRight());
	  				size--;
	  				return subtree.getRight();
	  			}
	  		}
	  		//The position has two children, in which case we need to follow the algorithm
	  		else {
	  			MySimpleEntry entry = subtree.getLeft();
	  			while (entry.getRight() != null){
	  				entry = entry.getRight();
	  			}
	  			attachRight(entry, subtree.getRight());
	  			if (entry != subtree.getLeft()){
	  				if (entry.getLeft() != null){
	  					attachRight(entry.getParent(), entry.getLeft());
	  				}
	  				else{
	  					entry.getParent().setRight(null);
	  				}
	  				attachLeft(entry, subtree.getLeft());
	  			}
	  			else {
	  				if (subtree != root){
	  					entry.setParent(subtree.getParent());
	  				}
	  				else {
	  					entry.setParent(null);
	  					root = entry;
	  				}
	  			}
	  			size--;
	  			return entry;
	  		}
	  	}
	  	
	  	//Recursive case 1: k< subtree.getKey()
	  	if (k.compareTo(subtree.getKey())<0){
	  		MySimpleEntry entry = removeSubtree(k, subtree.getLeft());
	  		if (entry == null){
	  			return subtree;
	  		}
	  		attachLeft(subtree, entry);
	  		return subtree;
	  	}
	  	else {
	  	//Recursive case 2: k> subtree.getKey()
	  		MySimpleEntry entry = removeSubtree(k, subtree.getRight());
	  		if (entry == null){
	  			return subtree;
	  		}
	  		attachRight(subtree, entry);
	  		
	  		return subtree;
	  	}
  }
  
  public void inOrder(MySimpleEntry current){
	  if (current.getLeft() != null){
		  inOrder(current.getLeft());
	  }
	  System.out.println(current.getKey());
	  if (current.getRight() != null){
		  inOrder(current.getRight());
	  }
  }

  @Override
  public Iterable<Integer> keySet() {
    throw new java.lang.UnsupportedOperationException();
  }

  @Override
  public Iterable<String> values() {
    throw new java.lang.UnsupportedOperationException();
  }

  @Override
  public Iterable<SimpleEntry> entrySet() {
    throw new java.lang.UnsupportedOperationException();
  }

  //////////////////////////
  // SortedMap ADT methods:
  //////////////////////////

  @Override
  public SimpleEntry firstEntry() {
    throw new java.lang.UnsupportedOperationException();
  }

  @Override
  public SimpleEntry lastEntry() {
    throw new java.lang.UnsupportedOperationException();
  }

  @Override
  public SimpleEntry ceilingEntry(Integer key) {
    throw new java.lang.UnsupportedOperationException();
  }

  @Override
  public SimpleEntry floorEntry(Integer key) {
    throw new java.lang.UnsupportedOperationException();
  }

  @Override
  public SimpleEntry lowerEntry(Integer key) {
    throw new java.lang.UnsupportedOperationException();
  }

  @Override
  public SimpleEntry higherEntry(Integer key) {
    throw new java.lang.UnsupportedOperationException();
  }

  @Override
  public Iterable<Integer> subMap(Integer fromKey, Integer toKey) {
    throw new java.lang.UnsupportedOperationException();
  }
}
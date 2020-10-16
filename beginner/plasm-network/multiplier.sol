
pragma solidity 0;

contract multiplier {
	uint32 private value;

	/// Constructor that initializes the `int32` value to the given `x`.
	constructor(uint32 x) {
		value = x;
	}

	/// This multiplies the value by `y`. 
	function mul(uint32 y) public {
		value *= y;
	}

	/// Simply returns the current value of our `uint32`.
	function get() public view returns (uint32) {
		return value;
	}
}

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FakeFractalToken is ERC20 {
  constructor(address targetOwner) public ERC20("Fractal Protocol Token", "FCL") {
    _mint(targetOwner, 465000000000000000000000000);
  }
}

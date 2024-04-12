// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract schtroumpf {
    int[] public tab1;
    int[] public tab2;
// Remplir les tableaux...
    function addToTab1(int number) public {
        tab1.push(number);
    }
    function addToTab2(int number) public {
        tab2.push(number);
    }
// Effacer le contenu du tableau...
    function clearTab1() public {
        delete tab1;
    }
    function clearTab2() public {
        delete tab2;
    }
// calcule le schtroumpf des deux tableaux...
    function schtroumpfTab() public view returns (int) {
        int S = 0;
        for (uint256 x = 0; x < tab1.length; x++) {
            for (uint256 y = 0; y < tab2.length; y++) {
                S = S + tab1[x] * tab2[y];
            }
        }
        return S;
    }
}

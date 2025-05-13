// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DatteRegistry {
    struct Datte {
        string typeDeDatte;
        string hashImageIPFS;
        string localisation;
        string producteur;
        string dateDetection;
        uint8 confiance;
        address auteur;
    }

    mapping(uint256 => Datte) public dattes;
    uint256 public totalDattes;

    constructor() {
        totalDattes = 0;
    }

    function enregistrerDatte(
        string memory _typeDeDatte,
        string memory _hashImageIPFS,
        string memory _localisation,
        string memory _producteur,
        string memory _dateDetection,
        uint8 _confiance
    ) public payable {
        require(msg.value >= 0.01 ether, "Un minimum de paiement de 0.01 ETH est requis.");

        dattes[totalDattes] = Datte(
            _typeDeDatte,
            _hashImageIPFS,
            _localisation,
            _producteur,
            _dateDetection,
            _confiance,
            msg.sender
        );
        totalDattes++;
    }

    function getDatte(uint256 _id)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            uint8,
            address
        )
    {
        require(_id < totalDattes, "ID invalide");
        Datte memory d = dattes[_id];
        return (
            d.typeDeDatte,
            d.hashImageIPFS,
            d.localisation,
            d.producteur,
            d.dateDetection,
            d.confiance,
            d.auteur
        );
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

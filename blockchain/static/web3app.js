let web3;
let contract;

window.addEventListener('load', async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);

    // 🔐 Demande d'accès à MetaMask
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // 📝 Adresse de ton contrat (remplace-la si tu redeployes)
    const contractAddress = "0x96cF961A8D66d97Fd77aE5b53c0b697669550dF6";

    // 📄 Chargement de l'ABI du contrat
    const response = await fetch("/static/DatteRegistry.json");
    const artifact = await response.json();

    // 🧠 Initialisation du contrat
    contract = new web3.eth.Contract(artifact.abi, contractAddress);

    console.log("✅ Contrat initialisé :", contractAddress);
  } else {
    alert("⚠️ MetaMask n'est pas installé. Veuillez l'ajouter à votre navigateur.");
  }
});

document.getElementById("datteForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // ⏳ Étape 1 : appel à Flask pour classification IA
  const res = await fetch("/predict", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  if (data.status === "success") {
    // ✅ Étape 2 : enregistrement sur la blockchain via MetaMask
    const accounts = await web3.eth.getAccounts();
    try {
      const receipt = await contract.methods.enregistrerDatte(
        data.predicted_class,
        formData.get("hashImageIPFS"),
        formData.get("localisation"),
        formData.get("producteur"),
        data.dateDetection,
        data.confiance
      ).send({
        from: accounts[0],
        value: web3.utils.toWei("0.01", "ether")  // 💰 paiement requis
      });

      document.getElementById("result").innerText = `✅ Datte ${data.predicted_class} enregistrée. TX: ${receipt.transactionHash}`;
    } catch (err) {
      document.getElementById("result").innerText = `❌ Transaction échouée : ${err.message}`;
      console.error(err);
    }
  } else {
    document.getElementById("result").innerText = `❌ Erreur côté serveur : ${data.message}`;
  }
});
async function enregistrerSurBlockchain(typeDeDatte, hashImageIPFS, localisation, producteur, dateDetection, confiance) {
    const accounts = await web3.eth.getAccounts();
    const from = accounts[0];
  
    return contract.methods.enregistrerDatte(
      typeDeDatte,
      hashImageIPFS,
      localisation,
      producteur,
      dateDetection,
      confiance
    ).send({
      from: from,
      value: web3.utils.toWei("0.01", "ether")
    });
  }
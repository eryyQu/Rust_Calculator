
const DATA_URL = ""

let explosives = {};

const c4Input = document.getElementById("c4");
const rocketInput = document.getElementById("rocket");
const Explo_AmmoInput = document.getElementById("Explo_Ammo");
const satchelInput = document.getElementById("satchel");
const BeancanInput = document.getElementById("Beancan");
const ExplosivesInput = document.getElementById("Explosives");
const Gun_PowderInput = document.getElementById("Gun_Powder");

const generalMaterialsDiv = document.getElementById("general-materials");
const basicMaterialsDiv = document.getElementById("basic-materials");

function getMaterialImage(material) {
  const formattedMaterial = material.toLowerCase();
  return `images/${formattedMaterial}.png`;
}

document.querySelectorAll(".number-input").forEach(wrapper => {
  const input = wrapper.querySelector("input");
  wrapper.querySelector(".increment").addEventListener("click", () => {
    input.stepUp();
    input.dispatchEvent(new Event("input"));
  });
  wrapper.querySelector(".decrement").addEventListener("click", () => {
    input.stepDown();
    input.dispatchEvent(new Event("input"));
  });
});


function updateMaterials() {
  generalMaterialsDiv.innerHTML = "";
  basicMaterialsDiv.innerHTML = "";

  const totalGeneral = {};
  const totalBasic = {};

  function addMaterials(type, count) {
    const item = explosives[type];
    if (!item || !count || count <= 0) return;

    for (const [material, amount] of Object.entries(item.generalMaterials || {})) {
      totalGeneral[material] = (totalGeneral[material] || 0) + amount * count;
    }
    for (const [material, amount] of Object.entries(item.basicMaterials || {})) {
      const calculatedAmount = amount * count;
      totalBasic[material] =
        (totalBasic[material] || 0) +
        (material === "Animal_Fat" ? Math.round(calculatedAmount) : calculatedAmount);
    }
  }

  addMaterials("c4", parseInt(c4Input?.value) || 0);
  addMaterials("rocket", parseInt(rocketInput?.value) || 0);
  addMaterials("Explo_Ammo", parseInt(Explo_AmmoInput?.value) || 0);
  addMaterials("satchel", parseInt(satchelInput?.value) || 0);
  addMaterials("Beancan", parseInt(BeancanInput?.value) || 0);
  addMaterials("Explosives", parseInt(ExplosivesInput?.value) || 0);
  addMaterials("Gun_Powder", parseInt(Gun_PowderInput?.value) || 0);

  for (const [material, amount] of Object.entries(totalGeneral)) {
    const p = document.createElement("p");
    p.classList.add("itemname");
    p.innerHTML = `
      <img src="${getMaterialImage(material)}" alt="${material}" class="material-img">
      <span>${amount} ${material.replace(/_/g, " ")}</span>
    `;
    generalMaterialsDiv.appendChild(p);
  }

  for (const [material, amount] of Object.entries(totalBasic)) {
    const p = document.createElement("p");
    p.classList.add("itemname");
    p.innerHTML = `
      <img src="${getMaterialImage(material)}" alt="${material}" class="material-img">
      <span>${amount} ${material.replace(/_/g, " ")}</span>
    `;
    basicMaterialsDiv.appendChild(p);
  }
}

[c4Input, rocketInput, Explo_AmmoInput, satchelInput, BeancanInput, ExplosivesInput, Gun_PowderInput]
  .filter(Boolean)
  .forEach((input) => input.addEventListener("input", updateMaterials));

(async function loadDataAndInit() {
  try {
    const res = await fetch(DATA_URL, { cache: "no-cache" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const json = await res.json();

    explosives = json.explosives ? json.explosives : json;
  } catch (err) {
    console.error("Nie udało się pobrać danych z GitHuba:", err);
    alert("Nie udało się pobrać danych. Sprawdź URL lub plik w repo Rust_Calculator.");
  }

  updateMaterials();
})();

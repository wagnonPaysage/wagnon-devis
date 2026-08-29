const fs = require("fs");
const XLSX = require("xlsx");
const { PDFDocument, StandardFonts } = require("pdf-lib");
const { execSync } = require("child_process");

(async () => {
const fichierExcel = "Wagnon_Paysage_Outil_Patron_V9.xlsx";

  // ===== Lecture Excel =====
const workbook = XLSX.readFile(fichierExcel);
  const sheet = workbook.Sheets["Devis terrain"];

const client = "Nom Prénom";
const prestation = sheet["B2"]?.v || "Taille de haie";
const ml = Number(sheet["B3"]?.v || 20);
const hauteur = Number(sheet["B4"]?.v || 1.8);
const faces = Number(sheet["B5"]?.v || 2);
const adresse = "Adresse du client";
const telephone = "06 00 00 00 00";

const prixUnitaire = 12;

const totalHT = ml * prixUnitaire;
const tva = Math.round(totalHT * 0.20);
const totalTTC = totalHT + tva;

  // ===== Numéro automatique =====
  fs.mkdirSync("pdf", { recursive: true });

  const compteur = "pdf/compteur.txt";
  let numero = 0;

  if (fs.existsSync(compteur)) {
    numero = Number(fs.readFileSync(compteur, "utf8"));
  }

  numero++;
  fs.writeFileSync(compteur, String(numero));

  const numeroDevis = String(numero).padStart(4, "0");

  // ===== PDF =====
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // ===== Logo =====
  if (fs.existsSync("logo.jpg")) {
    const logo = await pdf.embedJpg(fs.readFileSync("logo.jpg"));
    page.drawImage(logo, {
      x: 40,
      y: 705,
      width: 100,
      height: 75,
    });
  }

  // ===== Coordonnées =====
  page.drawText("Wagnon Paysage", {
    x: 40,
    y: 685,
    size: 12,
    font: fontBold,
  });

  page.drawText("Entretien - Création - Plantation", {
    x: 40,
    y: 670,
    size: 8,
    font,
  });

  page.drawText("07 84 31 26 42", {
    x: 40,
    y: 655,
    size: 8,
    font,
  });

  page.drawText("contact@wagnonpaysage.fr", {
    x: 40,
    y: 640,
    size: 8,
    font,
  });

  // ===== Numéro =====
  page.drawText(`DEVIS N°${numeroDevis}`, {
    x: 390,
    y: 760,
    size: 18,
    font: fontBold,
  });

  page.drawText(`Date : ${new Date().toLocaleDateString("fr-FR")}`, {
    x: 390,
    y: 740,
    size: 11,
    font,
  });

  // ===== Titre =====
  let y = 590;

  page.drawText("DEVIS", {
    x: 40,
    y,
    size: 28,
    font: fontBold,
  });

  y -= 40;

  function ligne(label, valeur) {
    page.drawText(label + " :", {
      x: 40,
      y,
      size: 12,
      font: fontBold,
    });

    page.drawText(String(valeur), {
      x: 140,
      y,
      size: 12,
      font,
    });

    y -= 28;
  }

  ligne("Client", client);
  ligne("Adresse", adresse);
  ligne("Téléphone", telephone);
  ligne("Prestation", prestation);
  ligne("Mètres linéaires", ml + " m");
  ligne("Hauteur", hauteur + " m");
  ligne("Faces à tailler", faces);

  // ===== Tableau =====
  y -= 20;

  page.drawLine({
    start: { x: 40, y },
    end: { x: 555, y },
    thickness: 1,
  });

  y -= 22;

  page.drawText("Désignation", { x: 40, y, size: 11, font: fontBold });
  page.drawText("Qté", { x: 300, y, size: 11, font: fontBold });
  page.drawText("PU", { x: 390, y, size: 11, font: fontBold });
  page.drawText("Total HT", { x: 470, y, size: 11, font: fontBold });

  y -= 18;

  page.drawLine({
    start: { x: 40, y },
    end: { x: 555, y },
    thickness: 1,
  });

  y -= 24;

  page.drawText(String(prestation), { x: 40, y, size: 12, font });
  page.drawText(`${ml} m`, { x: 300, y, size: 12, font });
  page.drawText(`${prixUnitaire} €`, { x: 390, y, size: 12, font });
  page.drawText(`${totalHT} €`, { x: 470, y, size: 12, font });

  // ===== Totaux =====
  y -= 35;

  page.drawLine({
    start: { x: 250, y },
    end: { x: 555, y },
    thickness: 1,
  });

  y -= 22;

  page.drawText(`Total HT : ${totalHT} €`, {
    x: 330,
    y,
    size: 12,
    font,
  });

  y -= 22;

  page.drawText(`TVA (20 %) : ${tva} €`, {
    x: 330,
    y,
    size: 12,
    font,
  });

  y -= 30;

  page.drawText(`TOTAL TTC : ${totalTTC} €`, {
    x: 285,
    y,
    size: 20,
    font: fontBold,
  });

  // ===== Signature =====
  page.drawLine({
    start: { x: 40, y: 90 },
    end: { x: 555, y: 90 },
    thickness: 0.8,
  });

  page.drawText("Conditions : paiement à réception du devis signé.", {
    x: 40,
    y: 72,
    size: 9,
    font,
  });

  page.drawText("Signature client :", {
    x: 360,
    y: 72,
    size: 9,
    font,
  });

  fs.writeFileSync("pdf/devis.pdf", await pdf.save());

  console.log(`✅ Devis N°${numeroDevis} généré : pdf/devis.pdf`);
})();

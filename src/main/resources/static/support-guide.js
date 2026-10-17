let schemaSeq = 0;

function schema(boxes) {
  const marker = "arr" + (++schemaSeq);
  const width = 24 + boxes.length * 198;
  const body = boxes.map((box, index) => {
    const x = 12 + index * 198;
    const arrow = index < boxes.length - 1
      ? `<path d="M${x + 168} 72 h18" stroke="#137a6c" stroke-width="2" marker-end="url(#${marker})"/>`
      : "";
    return `<g><rect x="${x}" y="28" width="160" height="88" rx="14" fill="${box.fill || "#e3f8f3"}" stroke="#137a6c"/>
      <text x="${x + 80}" y="64" text-anchor="middle" font-size="13" font-family="Inter, Noto Sans Arabic, sans-serif" fill="#17212b">${box.title}</text>
      <text x="${x + 80}" y="86" text-anchor="middle" font-size="11" font-family="Inter, Noto Sans Arabic, sans-serif" fill="#137a6c">${box.sub}</text></g>${arrow}`;
  }).join("");
  return `<div class="schema"><svg viewBox="0 0 ${width} 144" role="img" xmlns="http://www.w3.org/2000/svg"><defs><marker id="${marker}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="#137a6c"/></marker></defs>${body}</svg></div>`;
}

const CORE_EXAMPLE = `{
  "sourceSystem": "CORE_BANKING",
  "externalBatchId": "LOT-COURS-1",
  "balances": [{
    "externalId": "SOLDE-BCT",
    "entityId": "TN-BANK",
    "accountId": "TN-BCT-TND",
    "currency": "TND",
    "bookedAmount": "1000.00",
    "availableAmount": "1000.00",
    "asOf": "2026-10-17",
    "sourceReference": "COURS-BCT"
  }],
  "movements": [{
    "externalId": "MVT-1",
    "entityId": "TN-BANK",
    "accountId": "TN-BCT-TND",
    "currency": "TND",
    "amount": "250.00",
    "valueDate": "2026-10-17",
    "bookingDate": "2026-10-17",
    "reference": "VIR-CLIENT"
  }]
}`;

const MT940_EXAMPLE = `:20:STMT1
:25:EU-TARGET-EUR
:60F:C261017EUR10000,00
:61:261017C250,00NTRFLOYER
:62F:C261017EUR10250,00`;

const FINERACT_TN_IMPORT = `{
  "sourceSystem": "FINERACT",
  "externalBatchId": "FINERACT-TN-BCT-2026-10-17",
  "balances": [
    {
      "externalId": "FIN-JE-BAL-1010-20261017",
      "entityId": "TN-BANK",
      "accountId": "TN-BCT-TND",
      "currency": "TND",
      "bookedAmount": "512475125.500",
      "availableAmount": "512475125.500",
      "asOf": "2026-10-17",
      "sourceReference": "GL-1010"
    }
  ],
  "movements": [
    {
      "externalId": "FIN-JE-88421",
      "entityId": "TN-BANK",
      "accountId": "TN-BCT-TND",
      "currency": "TND",
      "amount": "-150000.000",
      "valueDate": "2026-10-17",
      "bookingDate": "2026-10-17",
      "reference": "SGMT-FOURN-441"
    },
    {
      "externalId": "FIN-JE-88422",
      "entityId": "TN-BANK",
      "accountId": "TN-BCT-TND",
      "currency": "TND",
      "amount": "-24875.250",
      "valueDate": "2026-10-17",
      "bookingDate": "2026-10-17",
      "reference": "SIBTEL-SAL-202610"
    },
    {
      "externalId": "FIN-JE-88430",
      "entityId": "TN-BANK",
      "accountId": "TN-BCT-TND",
      "currency": "TND",
      "amount": "175000.000",
      "valueDate": "2026-10-17",
      "bookingDate": "2026-10-17",
      "reference": "SGMT-ENC-CLIENT-18"
    }
  ]
}`;

window.TF_SUPPORT = {
  fr: {
    lead: "Prise en main, sans jeu de soldes préchargé. Chaque chapitre dit qui agit, quoi saisir, et ce qui doit apparaître. Les schémas suivent l'ordre réel des écrans.",
    chapters: [
      {
        title: "1. À quoi sert un outil de cash management",
        goal: "Le cash management répond à trois questions : combien est disponible aujourd'hui, combien le sera dans les prochains jours, et quelle instruction envoyer à la banque. TreasoryFlow sépare ces trois choses.",
        schema: schema([
          { title: "Compte", sub: "solde du jour" },
          { title: "Prévision", sub: "flux à venir" },
          { title: "Instruction", sub: "paiement" },
          { title: "Relevé", sub: "ce qui est passé" }
        ]),
        steps: [
          "Le solde est ce que la banque confirme. Il n'existe ici qu'après un import.",
          "Une prévision est une hypothèse : un encaissement client, une échéance. Elle ne change pas le solde bancaire.",
          "Un paiement est une instruction. Il ne diminue le solde que lorsque le relevé bancaire revient.",
          "Le rapprochement compare ensuite l'instruction et le mouvement du relevé."
        ],
        expect: "Aucun écran n'affiche un solde tant que vous n'avez pas importé un lot ou un relevé."
      },
      {
        title: "2. Les deux livres de Nexus Bank",
        goal: "Nexus Bank a deux périmètres de trésorerie. Le code que vous pouvez voir dans un fichier n'est pas le nom d'une banque de la place.",
        schema: schema([
          { title: "Nexus Bank", sub: "Tunisie · TND" },
          { title: "Compte BCT", sub: "TN-BCT-TND" },
          { title: "Nostro EUR", sub: "TN-NOSTRO-EUR" },
          { title: "Europe", sub: "Compte TARGET" }
        ]),
        steps: [
          "Nexus Bank, en Tunisie, tient le dinar. Sa liquidité n'est pas librement transférable vers l'Europe.",
          "Nexus Bank — Europe tient l'euro, sur le compte TARGET.",
          "Dans un fichier d'import, le périmètre tunisien s'écrit TN-BANK et le périmètre européen EU-BANK. Ce sont des codes internes, pas des banques de l'annuaire.",
          "Le compte à la Banque centrale s'écrit TN-BCT-TND. Le nostro en euros de Tunisie s'écrit TN-NOSTRO-EUR. Le compte européen s'écrit EU-TARGET-EUR.",
          "Le tableau de bord liste aussi les 23 banques de la place, avec leur site et leur BIC lorsqu'il est publié. Aucune d'elles n'est le livre de Nexus Bank, et aucune n'a de solde ici."
        ],
        expect: "Deux cartes : Nexus Bank et Nexus Bank — Europe. Le code TN-BANK n'est pas affiché comme un nom."
      },
      {
        title: "3. Importer le solde du compte BCT",
        goal: "Le premier solde vient d'un lot du système central. L'exemple ci-dessous charge 1 000 dinars disponibles, plus un mouvement de 250 dinars déjà passé.",
        schema: schema([
          { title: "Fichier", sub: "lot core" },
          { title: "Contrôle", sub: "même lot = rejeu" },
          { title: "Position", sub: "1 000 TND" }
        ]),
        steps: [
          "Restez sur Sara, trésorerie. Ouvrez Intégration.",
          "Le cadre Lot à importer contient déjà l'exemple. entityId TN-BANK désigne Nexus Bank. accountId TN-BCT-TND désigne le compte BCT.",
          "Cliquez Importer un lot. Le message indique un statut et rejoué : non.",
          "Ouvrez Positions. La ligne Compte BCT montre 1 000,00 TND disponible.",
          "Revenez à Intégration et cliquez Rejouer le même lot, sans modifier le texte. rejoué passe à oui. Le solde ne double pas.",
          "Si vous changez le montant et gardez externalBatchId LOT-COURS-1, l'import est refusé : un lot déjà reçu ne peut pas changer de contenu."
        ],
        example: CORE_EXAMPLE,
        expect: "Positions affiche 1 000,00 TND sur le compte BCT. Le second envoi du même texte ne crée pas un second solde."
      },
      {
        title: "4. Importer un relevé de fin de journée",
        goal: "Le MT940 est le relevé que la banque envoie le soir. Ici le message est lu dans le bac à sable : il n'est pas reçu d'un réseau.",
        schema: schema([
          { title: ":25:", sub: "quel compte" },
          { title: ":61:", sub: "un mouvement" },
          { title: ":62F:", sub: "solde de clôture" }
        ]),
        steps: [
          "Toujours dans Intégration, descendez à Relevé MT940. Le texte d'exemple est déjà dans le cadre.",
          ":25:EU-TARGET-EUR dit que le relevé concerne le compte TARGET de Nexus Bank — Europe.",
          ":60F: est le solde d'ouverture, 10 000 euros. :61: est un encaissement de 250 euros, référence LOYER. :62F: est la clôture, 10 250 euros.",
          "Le lot s'appelle MT940-DEMO. Cliquez Intégrer le relevé.",
          "Ouvrez Position de cash, choisissez Nexus Bank — Europe, puis Afficher la position. Le compte TARGET affiche 10 250 euros.",
          "Intégrez une seconde fois le même lot : le rejeu ne crée pas un second relevé."
        ],
        example: MT940_EXAMPLE,
        expect: "La position européenne du 17 octobre 2026 est de 10 250,00 EUR. Le livre tunisien n'est pas modifié par ce relevé."
      },
      {
        title: "5. Lire la position et ajouter une prévision",
        goal: "La position à 7 jours part du disponible d'aujourd'hui et ajoute les flux que vous saisissez. Une prévision n'est pas un paiement.",
        schema: schema([
          { title: "Disponible", sub: "après import" },
          { title: "Flux", sub: "date de valeur" },
          { title: "Clôture", sub: "jour par jour" }
        ]),
        steps: [
          "Menu Position de cash, entité Nexus Bank, Afficher la position. Après le lot du chapitre 3, le compte BCT est à 1 000 TND chaque jour, parce qu'aucun flux futur n'est saisi.",
          "Menu Prévisions. Entité Nexus Bank — Europe, compte TARGET, montant 500, date 2026-10-20, nature ESTIMATED, libellé Encaissement client. Ajouter le flux.",
          "La projection se recharge. Le 17 octobre reprend le disponible importé. Le 20 octobre augmente de 500 euros.",
          "Revenez à Position de cash sur Nexus Bank — Europe. L'horizon du 20 octobre inclut cet encaissement. Le solde bancaire du jour, lui, reste celui du relevé.",
          "Le scénario STRESS_DELAY décale les entrées. STRESS_FUNDING retire les flux marqués annulables. L'encaissement saisi ici n'est pas annulable."
        ],
        expect: "Le 20 octobre 2026, la clôture européenne est supérieure de 500 euros au disponible du relevé. Le 17 octobre ne bouge pas."
      },
      {
        title: "6. Envoyer un paiement fournisseur",
        goal: "Quatre yeux : la personne qui saisit n'est pas celle qui valide. Le paiement reste une instruction tant que le relevé n'est pas revenu.",
        schema: schema([
          { title: "Sara", sub: "brouillon soumis" },
          { title: "Karim", sub: "valide" },
          { title: "Remise", sub: "message local" }
        ]),
        steps: [
          "Sara, menu Paiements. Entité Nexus Bank — Europe, compte TARGET, bénéficiaire Fournisseur cours, montant 1000.00, objet SUPPLIER. Laissez l'entité bénéficiaire vide. Enregistrer et soumettre.",
          "Le statut devient PENDING_VALIDATION. Cliquez Approuver sans changer d'acteur : Sara ne peut pas valider son propre ordre.",
          "Passez à Karim, validation, et approuvez. Le statut devient VALIDATED.",
          "Revenez à Sara, menu Intégration, entité Nexus Bank — Europe, Produire la remise. Un message pain.001 apparaît, mention sandbox-only. Le paiement passe à TRANSMITTED.",
          "Une seconde remise ne crée pas un second message. Le solde du compte TARGET ne diminue pas : seul un nouveau relevé le ferait."
        ],
        expect: "Un message local est produit. Rien n'est émis vers SEPA, TARGET, SWIFT, la BCT ou SIBTEL."
      },
      {
        title: "7. Pourquoi un virement Tunisie vers Europe est refusé",
        goal: "La trésorerie tunisienne finance la Tunisie. Elle n'alimente pas le compte européen, même si les deux livres appartiennent à Nexus Bank.",
        schema: schema([
          { title: "Nexus Bank", sub: "TND restreint", fill: "#fff4e8" },
          { title: "Contrôle", sub: "transfert bloqué", fill: "#fff4e8" },
          { title: "Europe", sub: "se finance ici", fill: "#e3f8f3" }
        ]),
        steps: [
          "Sara, Paiements. Entité Nexus Bank, compte Nostro EUR, bénéficiaire Nexus Bank — Europe, montant 1000, objet INTERCOMPANY.",
          "Dans Entité bénéficiaire, saisissez le code interne EU-BANK. C'est le seul endroit où ce code est demandé : il désigne Nexus Bank — Europe, pas une banque de la place.",
          "Enregistrez. L'ordre reste en brouillon. Le motif reprend la contrainte de change : la trésorerie tunisienne n'est pas librement transférable.",
          "Le même contrôle existe au cash pooling. Menu Cash pooling, Niveler sur le pool EUR physique. Le nostro tunisien n'est pas rapatrié vers le compte TARGET.",
          "Le pool TND est notionnel : il additionne, il ne propose pas de virement."
        ],
        expect: "Le paiement intragroupe reste en brouillon. Le nivellement du nostro EUR est à zéro, avec un motif de non-transférabilité."
      },
      {
        title: "8. Choisir le rail, sans se raccorder au réseau",
        goal: "Le paramétrage décide du canal. Le message est fabriqué ici pour l'apprentissage. Ce n'est pas une connexion à la BCT.",
        schema: schema([
          { title: "Objet", sub: "salaire, fournisseur" },
          { title: "Seuil", sub: "100 000 TND" },
          { title: "Canal", sub: "SIBTEL ou SGMT" }
        ]),
        steps: [
          "Menu Paramétrage. SGMT_FLOOR_TND vaut 100000. En dessous, un fournisseur en dinars part en télécompensation SIBTEL, dénouement le lendemain, heure limite 12:00. À partir de ce montant, il part en SGMT, le règlement brut, heure limite 16:30.",
          "Menu Intégration, Router. Nexus Bank, 150000 TND, SUPPLIER. Le canal affiché est SGMT. Recommencez avec 1000 TND : SIBTEL.",
          "Un salaire reste en SIBTEL même au-dessus de 100 000, parce que son profil est fixe. Un virement de trésorerie en dinars, sans sortie du pays, part en SGMT.",
          "Un fournisseur en euros depuis la Tunisie part en SWIFT. Depuis l'Europe, 1 000 euros partent en SEPA et 1 000 000 euros partent en TARGET.",
          "INTERCOMPANY vers EU-BANK ne propose aucun canal."
        ],
        expect: "Le canal change avec le montant et l'objet. Le texte du canal rappelle que l'adaptateur est un bac à sable."
      },
      {
        title: "9. Produire un premier ratio, puis lire l'audit",
        goal: "Le ratio ne s'invente pas un stock. Leila saisit les postes, puis le calcul fige la version de règle. Nicolas lit le journal, il ne modifie rien.",
        schema: schema([
          { title: "Poste", sub: "cash et dépôts" },
          { title: "Formule", sub: "Tunisie seulement" },
          { title: "État", sub: "figé" }
        ]),
        steps: [
          "Passez à Leila, conformité. Menu Calculs. Sans poste, Ratio tunisien répond qu'aucune donnée source n'existe à la date.",
          "Ajoutez un poste : entité Nexus Bank, formule TN_LIQUIDITY_STOCK, sens ASSET, poste CASH_BCT, 1000.00 TND, référence COURS-CASH.",
          "Ajoutez le second : sens LIABILITY, poste DEMAND_DEPOSITS, 800.00 TND, référence COURS-DEP.",
          "Cliquez Ratio tunisien. Le résultat est 125,00 % : 1 000 divisé par 800. Leila peut valider l'état.",
          "Lancez le LCR européen sur Nexus Bank : refusé, la formule européenne ne s'applique pas à la Tunisie.",
          "Passez à Nicolas et ouvrez Audit. Les imports, le flux, le paiement et le calcul y sont. Revenez à Sara : l'audit répond que le rôle est insuffisant."
        ],
        expect: "Le ratio tunisien affiche 125,00 % sur les deux postes saisis. L'ancien résultat, s'il y en a un, n'est pas réécrit."
      },
      {
        title: "10. Exporter Fineract, importer le lot tunisien",
        goal: "Fineract exporte le journal. TreasoryFlow importe un lot JSON sur le compte BCT, en dinars, avec trois décimales. Le livre européen ne se mélange pas à ce lot. Cet exemple remplace le solde : ne le collez que si vous voulez charger ce journal.",
        schema: schema([
          { title: "Journal", sub: "Fineract" },
          { title: "Lot JSON", sub: "compte BCT" },
          { title: "Rejeu", sub: "même identifiant" }
        ]),
        steps: [
          "Export Fineract : GET /fineract-provider/api/v1/journalentries?fromDate=2026-10-17&toDate=2026-10-17&dateFormat=yyyy-MM-dd&locale=en&runningBalance=true&transactionDetails=true, en-tête Fineract-Platform-TenantId. Chaque ligne porte id, transactionId, transactionDate, amount, currency.code, entryType (DEBIT ou CREDIT), glAccountCode, referenceNumber, reversed.",
          "Ne garder que le compte de caisse BCT dont le code GL est mappé vers TN-BCT-TND, entité TN-BANK, devise TND. Une ligne EUR, ou un bureau du livre européen, ne s'écrit pas sur ce compte.",
          "Correspondance : externalId = FIN-JE-{id}, stable pour que le rejeu ne double pas. Sur ce compte d'actif, un DEBIT Fineract devient un montant positif (entrée), un CREDIT un montant négatif (sortie). Le solde du jour est organizationRunningBalance, copié en chaîne décimale, pas en flottant. Le dinar a trois décimales (millimes).",
          "externalBatchId FINERACT-TN-BCT-2026-10-17 est la clé d'idempotence. Le même identifiant et le même contenu répondent rejoué = oui. Le même identifiant avec un autre contenu est refusé.",
          "Contexte tunisien du fichier : 150 000,000 TND sortent en SGMT (RTGS BCT, pacs.008), car le fournisseur dépasse le seuil SGMT_FLOOR_TND de 100 000 dinars. 24 875,250 TND de salaires restent en télécompensation SIBTEL, dénouement J+1, même si l'on change le seuil : le profil PRF-TN-SALARY est fixe. 175 000,000 TND entrent en SGMT. Rien ne sort du pays.",
          "Contexte européen, autre lot, autre compte : FINERACT-EU-TARGET-2026-10-17, entité EU-BANK, compte EU-TARGET-EUR, devise EUR à deux décimales. En dessous de 1 000 000 EUR un fournisseur part en SEPA pain.001 ; à partir de ce montant, en TARGET pacs.008. Ce lot ne se poste pas sur TN-BCT-TND. Le dinar n'est pas librement transférable vers l'entité européenne.",
          "Les règles ne se croisent pas. Le stock de liquidité tunisien se mesure avec la circulaire BCT n° 2014-14. Le livre européen se mesure avec le LCR du CRR, règlement (UE) n° 575/2013, et le règlement délégué (UE) 2015/61. Lancer le LCR sur Nexus Bank, ou le ratio BCT sur le périmètre européen, est refusé."
        ],
        example: FINERACT_TN_IMPORT,
        expect: "Collé dans Intégration puis importé par Sara, le lot passe APPLIED. Le second envoi du même texte indique rejoué = oui et n'ajoute pas les trois mouvements. Le solde BCT de la date asOf est remplacé par 512 475 125,500 TND."
      }
    ]
  },
  en: {
    lead: "A first-use guide, with no preloaded balances. Each chapter names who acts, what to enter, and what should appear. The diagrams follow the real screen order.",
    chapters: [
      {
        title: "1. What a cash management tool is for",
        goal: "Cash management answers three questions: what is available today, what will be available over the next days, and which instruction to send the bank. TreasoryFlow keeps those three apart.",
        schema: schema([
          { title: "Account", sub: "today's balance" },
          { title: "Forecast", sub: "coming flows" },
          { title: "Instruction", sub: "payment" },
          { title: "Statement", sub: "what cleared" }
        ]),
        steps: [
          "A balance is what the bank confirms. It exists here only after an import.",
          "A forecast is an assumption: a customer receipt, a maturity. It does not change the bank balance.",
          "A payment is an instruction. It reduces the balance only when the bank statement comes back.",
          "Reconciliation then compares the instruction with the statement movement."
        ],
        expect: "No screen shows a balance until you import a batch or a statement."
      },
      {
        title: "2. Nexus Bank's two books",
        goal: "Nexus Bank has two treasury perimeters. A code you may see in a file is not the name of a bank on the directory.",
        schema: schema([
          { title: "Nexus Bank", sub: "Tunisia · TND" },
          { title: "BCT account", sub: "TN-BCT-TND" },
          { title: "EUR nostro", sub: "TN-NOSTRO-EUR" },
          { title: "Europe", sub: "TARGET account" }
        ]),
        steps: [
          "Nexus Bank, in Tunisia, holds dinars. That liquidity is not freely transferable to Europe.",
          "Nexus Bank — Europe holds euros, on the TARGET account.",
          "In an import file the Tunisian perimeter is written TN-BANK and the European perimeter EU-BANK. Those are internal codes, not banks from the directory.",
          "The central-bank account is TN-BCT-TND. The Tunisian euro nostro is TN-NOSTRO-EUR. The European account is EU-TARGET-EUR.",
          "The dashboard also lists the 23 banks of the place, with the public website and the BIC when one is published. None of them is Nexus Bank's book, and none has a balance here."
        ],
        expect: "Two cards: Nexus Bank and Nexus Bank — Europe. The code TN-BANK is not shown as a name."
      },
      {
        title: "3. Import the BCT account balance",
        goal: "The first balance comes from a core-system batch. The example below loads 1,000 dinars available, plus a 250 dinar movement that already happened.",
        schema: schema([
          { title: "File", sub: "core batch" },
          { title: "Check", sub: "same batch = replay" },
          { title: "Position", sub: "1,000 TND" }
        ]),
        steps: [
          "Stay as Sara, treasury. Open Integration.",
          "The batch box already contains the example. entityId TN-BANK means Nexus Bank. accountId TN-BCT-TND means the BCT account.",
          "Click Import a batch. The message shows a status and replayed: no.",
          "Open Positions. The BCT account line shows 1,000.00 TND available.",
          "Return to Integration and click Replay the same batch, without editing the text. replayed becomes yes. The balance does not double.",
          "If you change the amount and keep externalBatchId LOT-COURS-1, the import is rejected: a batch already received cannot change content."
        ],
        example: CORE_EXAMPLE,
        expect: "Positions shows 1,000.00 TND on the BCT account. Sending the same text again does not create a second balance."
      },
      {
        title: "4. Import an end-of-day statement",
        goal: "MT940 is the statement the bank sends in the evening. Here the message is read in the sandbox: it is not received from a network.",
        schema: schema([
          { title: ":25:", sub: "which account" },
          { title: ":61:", sub: "one movement" },
          { title: ":62F:", sub: "closing balance" }
        ]),
        steps: [
          "Still in Integration, go down to the MT940 statement. The sample text is already in the box.",
          ":25:EU-TARGET-EUR says the statement is for the TARGET account of Nexus Bank — Europe.",
          ":60F: is the opening balance, 10,000 euros. :61: is a 250 euro receipt, reference LOYER. :62F: is the closing balance, 10,250 euros.",
          "The batch id is MT940-DEMO. Click Import the statement.",
          "Open Cash position, choose Nexus Bank — Europe, then Show position. The TARGET account shows 10,250 euros.",
          "Import the same batch a second time: the replay does not create a second statement."
        ],
        example: MT940_EXAMPLE,
        expect: "The European position on 17 October 2026 is 10,250.00 EUR. The Tunisian book is unchanged by this statement."
      },
      {
        title: "5. Read the position and add a forecast",
        goal: "The 7-day position starts from today's available cash and adds the flows you enter. A forecast is not a payment.",
        schema: schema([
          { title: "Available", sub: "after import" },
          { title: "Flow", sub: "value date" },
          { title: "Closing", sub: "day by day" }
        ]),
        steps: [
          "Open Cash position, entity Nexus Bank, Show position. After the chapter 3 batch, the BCT account stays at 1,000 TND each day, because no future flow is entered.",
          "Open Forecasts. Entity Nexus Bank — Europe, TARGET account, amount 500, date 2026-10-20, nature ESTIMATED, label Customer receipt. Add the flow.",
          "The projection reloads. 17 October keeps the imported available cash. 20 October increases by 500 euros.",
          "Return to Cash position for Nexus Bank — Europe. The 20 October horizon includes that receipt. The bank balance of the day remains the statement balance.",
          "Scenario STRESS_DELAY shifts inflows. STRESS_FUNDING drops flows marked cancellable. The receipt entered here is not cancellable."
        ],
        expect: "On 20 October 2026 the European closing is 500 euros above the statement available cash. 17 October does not move."
      },
      {
        title: "6. Send a supplier payment",
        goal: "Four eyes: the person who captures is not the person who approves. The payment stays an instruction until the statement comes back.",
        schema: schema([
          { title: "Sara", sub: "submitted draft" },
          { title: "Karim", sub: "approves" },
          { title: "Remittance", sub: "local message" }
        ]),
        steps: [
          "As Sara, open Payments. Entity Nexus Bank — Europe, TARGET account, beneficiary Course supplier, amount 1000.00, purpose SUPPLIER. Leave the beneficiary entity empty. Save and submit.",
          "Status becomes PENDING_VALIDATION. Click Approve without switching actor: Sara cannot approve her own order.",
          "Switch to Karim, validation, and approve. Status becomes VALIDATED.",
          "Back to Sara, Integration, entity Nexus Bank — Europe, Produce the remittance. A pain.001 message appears, marked sandbox-only. The payment becomes TRANSMITTED.",
          "A second remittance does not create a second message. The TARGET balance does not fall: only a new statement would do that."
        ],
        expect: "A local message is produced. Nothing is sent to SEPA, TARGET, SWIFT, the BCT or SIBTEL."
      },
      {
        title: "7. Why a Tunisia-to-Europe transfer is refused",
        goal: "Tunisian cash funds Tunisia. It does not fund the European account, even though both books belong to Nexus Bank.",
        schema: schema([
          { title: "Nexus Bank", sub: "restricted TND", fill: "#fff4e8" },
          { title: "Control", sub: "transfer blocked", fill: "#fff4e8" },
          { title: "Europe", sub: "funds itself", fill: "#e3f8f3" }
        ]),
        steps: [
          "As Sara, open Payments. Entity Nexus Bank, EUR nostro, beneficiary Nexus Bank — Europe, amount 1000, purpose INTERCOMPANY.",
          "In Beneficiary entity, enter the internal code EU-BANK. This is the only field that asks for it: it means Nexus Bank — Europe, not a bank from the directory.",
          "Save. The order stays a draft. The reason repeats the FX constraint: Tunisian cash is not freely transferable.",
          "The same control exists in cash pooling. Open Cash pooling and sweep the physical EUR pool. The Tunisian nostro is not swept to the TARGET account.",
          "The TND pool is notional: it adds balances, it does not propose a transfer."
        ],
        expect: "The intercompany payment stays a draft. The EUR nostro sweep amount is zero, with a non-transferability reason."
      },
      {
        title: "8. Choose the rail, without connecting to the network",
        goal: "Setup decides the channel. The message is built here for learning. This is not a connection to the BCT.",
        schema: schema([
          { title: "Purpose", sub: "salary, supplier" },
          { title: "Floor", sub: "100,000 TND" },
          { title: "Channel", sub: "SIBTEL or SGMT" }
        ]),
        steps: [
          "Open Setup. SGMT_FLOOR_TND is 100000. Below that, a dinar supplier payment goes to SIBTEL clearing, next-day settlement, cutoff 12:00. From that amount it goes to SGMT, real-time gross settlement, cutoff 16:30.",
          "Open Integration, Route. Nexus Bank, 150000 TND, SUPPLIER. The channel shown is SGMT. Repeat with 1000 TND: SIBTEL.",
          "A salary stays on SIBTEL even above 100,000, because its profile is fixed. A dinar treasury transfer that does not leave the country goes to SGMT.",
          "A euro supplier payment from Tunisia goes to SWIFT. From Europe, 1,000 euros go to SEPA and 1,000,000 euros go to TARGET.",
          "INTERCOMPANY toward EU-BANK proposes no channel."
        ],
        expect: "The channel changes with the amount and the purpose. The channel text says the adapter is a sandbox."
      },
      {
        title: "9. Produce a first ratio, then read the audit",
        goal: "The ratio does not invent a stock. Leila enters the items, then the calculation freezes the rule version. Nicolas reads the journal and changes nothing.",
        schema: schema([
          { title: "Item", sub: "cash and deposits" },
          { title: "Formula", sub: "Tunisia only" },
          { title: "Report", sub: "frozen" }
        ]),
        steps: [
          "Switch to Leila, compliance. Open Calculations. With no item, Tunisian ratio answers that no source data exists on that date.",
          "Add an item: entity Nexus Bank, formula TN_LIQUIDITY_STOCK, side ASSET, bucket CASH_BCT, 1000.00 TND, reference COURS-CASH.",
          "Add the second: side LIABILITY, bucket DEMAND_DEPOSITS, 800.00 TND, reference COURS-DEP.",
          "Click Tunisian ratio. The result is 125.00%: 1,000 divided by 800. Leila can validate the report.",
          "Run the European LCR on Nexus Bank: refused, the European formula does not apply in Tunisia.",
          "Switch to Nicolas and open Audit. Imports, the flow, the payment and the calculation are there. Back to Sara: audit answers that the role is insufficient."
        ],
        expect: "The Tunisian ratio shows 125.00% on the two items you entered. An earlier result, if one exists, is not rewritten."
      },
      {
        title: "10. Export from Fineract, import the Tunisian batch",
        goal: "Fineract exports the journal. TreasoryFlow imports a JSON batch onto the BCT account, in dinars, with three decimal places. The European book is not mixed into this batch. This sample replaces the balance: paste it only when you mean to load that journal.",
        schema: schema([
          { title: "Journal", sub: "Fineract" },
          { title: "JSON batch", sub: "BCT account" },
          { title: "Replay", sub: "same id" }
        ]),
        steps: [
          "Fineract export: GET /fineract-provider/api/v1/journalentries?fromDate=2026-10-17&toDate=2026-10-17&dateFormat=yyyy-MM-dd&locale=en&runningBalance=true&transactionDetails=true, header Fineract-Platform-TenantId. Each row has id, transactionId, transactionDate, amount, currency.code, entryType (DEBIT or CREDIT), glAccountCode, referenceNumber, reversed.",
          "Keep only the BCT cash account whose GL code maps to TN-BCT-TND, entity TN-BANK, currency TND. An EUR line, or an office of the European book, is not written on this account.",
          "Mapping: externalId = FIN-JE-{id}, stable so a replay does not double. On this asset account a Fineract DEBIT becomes a positive amount (inflow) and a CREDIT a negative amount (outflow). The end-of-day balance is organizationRunningBalance, copied as a decimal string, never a float. The dinar has three decimal places (millimes).",
          "externalBatchId FINERACT-TN-BCT-2026-10-17 is the idempotency key. The same id and the same content return replayed = yes. The same id with different content is rejected.",
          "Tunisian context of the file: 150,000.000 TND leave through SGMT (BCT RTGS, pacs.008), because the supplier exceeds the SGMT_FLOOR_TND threshold of 100,000 dinars. A salary of 24,875.250 TND stays in SIBTEL clearing, settlement on J+1, even if the threshold changes: profile PRF-TN-SALARY is fixed. 175,000.000 TND come in through SGMT. Nothing leaves the country.",
          "European context, another batch, another account: FINERACT-EU-TARGET-2026-10-17, entity EU-BANK, account EU-TARGET-EUR, currency EUR with two decimal places. Below 1,000,000 EUR a supplier payment goes out as SEPA pain.001; from that amount, as TARGET pacs.008. That batch is not posted on TN-BCT-TND. The dinar is not freely transferable to the European entity.",
          "The rules do not cross. Tunisian liquidity stock is measured with BCT circular 2014-14. The European book is measured with the LCR of the CRR, Regulation (EU) No 575/2013, and Delegated Regulation (EU) 2015/61. Running the LCR on Nexus Bank, or the BCT ratio on the European scope, is refused."
        ],
        example: FINERACT_TN_IMPORT,
        expect: "Pasted into Integration and imported by Sara, the batch becomes APPLIED. Sending the same text again reports replayed = yes and does not add the three movements. The BCT balance on asOf is replaced by 512,475,125.500 TND."
      }
    ]
  },
  ar: {
    lead: "دليل البدء، من دون أرصدة محمّلة مسبقاً. كل فصل يحدّد من يفعل، وماذا يُدخل، وما الذي يجب أن يظهر. المخطّطات تتبع ترتيب الشاشات.",
    chapters: [
      {
        title: "1. فائدة تطبيق إدارة النقد",
        goal: "إدارة النقد تجيب عن ثلاثة أسئلة: كم هو المتاح اليوم، وكم سيكون في الأيام القادمة، وأي أمر يُرسل إلى البنك. TreasoryFlow تفصل بين هذه الثلاثة.",
        schema: schema([
          { title: "الحساب", sub: "رصيد اليوم" },
          { title: "التوقع", sub: "تدفقات قادمة" },
          { title: "الأمر", sub: "دفعة" },
          { title: "الكشف", sub: "ما تمّ" }
        ]),
        steps: [
          "الرصيد هو ما يؤكّده البنك. لا يوجد هنا إلا بعد استيراد.",
          "التوقع فرضية: تحصيل من زبون، أو استحقاق. لا يغيّر الرصيد البنكي.",
          "الدفعة أمر. لا تخفّض الرصيد إلا عندما يعود كشف البنك.",
          "المطابقة تقارن بعد ذلك بين الأمر وحركة الكشف."
        ],
        expect: "لا تعرض أي شاشة رصيداً قبل استيراد دفعة أو كشف."
      },
      {
        title: "2. دفترا Nexus Bank",
        goal: "لـ Nexus Bank نطاقان للخزينة. الرمز الذي قد يظهر في ملف ليس اسم بنك من القائمة.",
        schema: schema([
          { title: "Nexus Bank", sub: "تونس · دينار" },
          { title: "حساب المركزي", sub: "TN-BCT-TND" },
          { title: "نوسترو يورو", sub: "TN-NOSTRO-EUR" },
          { title: "أوروبا", sub: "حساب TARGET" }
        ]),
        steps: [
          "Nexus Bank في تونس تمسك الدينار. هذه السيولة ليست قابلة للتحويل بحرية إلى أوروبا.",
          "Nexus Bank — أوروبا تمسك اليورو في حساب TARGET.",
          "في ملف الاستيراد يُكتب النطاق التونسي TN-BANK والنطاق الأوروبي EU-BANK. هذان رمزان داخليان، وليسا بنكين من الدليل.",
          "حساب البنك المركزي هو TN-BCT-TND. نوسترو اليورو التونسي هو TN-NOSTRO-EUR. الحساب الأوروبي هو EU-TARGET-EUR.",
          "لوحة القيادة تعرض أيضاً بنوك الساحة الـ23، مع الموقع ورمز BIC حين يكون منشوراً. لا أحد منها هو دفتر Nexus Bank، ولا رصيد لأي منها هنا."
        ],
        expect: "بطاقتان: Nexus Bank وNexus Bank — أوروبا. الرمز TN-BANK لا يُعرض كاسم."
      },
      {
        title: "3. استيراد رصيد حساب البنك المركزي",
        goal: "أول رصيد يأتي من دفعة النظام المركزي. المثال يحمّل 1000 دينار متاح، مع حركة 250 ديناراً تمت فعلاً.",
        schema: schema([
          { title: "الملف", sub: "دفعة مركزية" },
          { title: "الرقابة", sub: "نفس الدفعة = إعادة" },
          { title: "الوضعية", sub: "1000 دينار" }
        ]),
        steps: [
          "ابقَ على سارة، الخزينة. افتح التكامل.",
          "إطار الدفعة يحتوي المثال. entityId بالقيمة TN-BANK يعني Nexus Bank. accountId بالقيمة TN-BCT-TND يعني حساب البنك المركزي.",
          "انقر استيراد دفعة. الرسالة تعرض حالة، وإعادة التشغيل: لا.",
          "افتح الوضعيات. سطر حساب البنك المركزي يعرض 1000,00 دينار متاح.",
          "عد إلى التكامل وانقر إعادة نفس الدفعة من دون تعديل النص. إعادة التشغيل تصبح نعم. الرصيد لا يتضاعف.",
          "إذا غيّرت المبلغ وأبقيت externalBatchId على LOT-COURS-1، يُرفض الاستيراد: دفعة مستلمة لا يمكن أن يتغيّر محتواها."
        ],
        example: CORE_EXAMPLE,
        expect: "الوضعيات تعرض 1000,00 دينار على حساب البنك المركزي. إرسال النص نفسه مرة ثانية لا ينشئ رصيداً ثانياً."
      },
      {
        title: "4. استيراد كشف نهاية اليوم",
        goal: "MT940 هو الكشف الذي يرسله البنك مساءً. هنا تُقرأ الرسالة في البيئة التجريبية: لا تصل من شبكة.",
        schema: schema([
          { title: ":25:", sub: "أي حساب" },
          { title: ":61:", sub: "حركة" },
          { title: ":62F:", sub: "رصيد الإقفال" }
        ]),
        steps: [
          "ما زلت في التكامل، انزل إلى كشف MT940. النص النموذجي موجود في الإطار.",
          ":25:EU-TARGET-EUR يعني أن الكشف يخص حساب TARGET لدى Nexus Bank — أوروبا.",
          ":60F: رصيد الافتتاح، 10000 يورو. :61: تحصيل 250 يورو، مرجع LOYER. :62F: الإقفال، 10250 يورو.",
          "معرّف الدفعة MT940-DEMO. انقر إدماج الكشف.",
          "افتح وضعية النقد، اختر Nexus Bank — أوروبا، ثم عرض الوضعية. حساب TARGET يعرض 10250 يورو.",
          "أعد إدماج الدفعة نفسها: الإعادة لا تنشئ كشفاً ثانياً."
        ],
        example: MT940_EXAMPLE,
        expect: "وضعية أوروبا في 17 أكتوبر 2026 هي 10250,00 يورو. الدفتر التونسي لا يتغيّر بهذا الكشف."
      },
      {
        title: "5. قراءة الوضعية وإضافة توقع",
        goal: "وضعية 7 أيام تنطلق من المتاح اليوم وتضيف التدفقات التي تدخلها. التوقع ليس دفعة.",
        schema: schema([
          { title: "المتاح", sub: "بعد الاستيراد" },
          { title: "التدفق", sub: "تاريخ القيمة" },
          { title: "الإقفال", sub: "يوماً بيوم" }
        ]),
        steps: [
          "قائمة وضعية النقد، الكيان Nexus Bank، عرض الوضعية. بعد دفعة الفصل 3 يبقى حساب البنك المركزي عند 1000 دينار كل يوم، لأنه لا يوجد تدفق مستقبلي.",
          "قائمة التوقعات. الكيان Nexus Bank — أوروبا، حساب TARGET، المبلغ 500، التاريخ 2026-10-20، الطبيعة ESTIMATED، البيان تحصيل زبون. إضافة التدفق.",
          "يُعاد الإسقاط. 17 أكتوبر يحتفظ بالمتاح المستورد. 20 أكتوبر يزيد بـ500 يورو.",
          "عد إلى وضعية النقد لأوروبا. أفق 20 أكتوبر يتضمّن هذا التحصيل. رصيد البنك في اليوم يبقى رصيد الكشف.",
          "سيناريو STRESS_DELAY يؤجّل الداخل. STRESS_FUNDING يسقط التدفقات القابلة للإلغاء. التحصيل المُدخل هنا غير قابل للإلغاء."
        ],
        expect: "في 20 أكتوبر 2026 يكون إقفال أوروبا أعلى بـ500 يورو من متاح الكشف. 17 أكتوبر لا يتحرك."
      },
      {
        title: "6. إرسال دفعة لمورّد",
        goal: "أربع أعين: من يُدخل ليس من يعتمد. تبقى الدفعة أمراً إلى أن يعود الكشف.",
        schema: schema([
          { title: "سارة", sub: "مسودة مرسلة" },
          { title: "كريم", sub: "يعتمد" },
          { title: "الإرسالية", sub: "رسالة محلية" }
        ]),
        steps: [
          "بسارة، قائمة المدفوعات. الكيان Nexus Bank — أوروبا، حساب TARGET، المستفيد مورّد الدورة، المبلغ 1000.00، الغرض SUPPLIER. اترك كيان المستفيد فارغاً. تسجيل وإرسال.",
          "تصبح الحالة PENDING_VALIDATION. انقر اعتماد من دون تغيير الفاعل: سارة لا تعتمد أمرها.",
          "انتقل إلى كريم، الاعتماد، ثم اعتمد. تصبح الحالة VALIDATED.",
          "عد إلى سارة، التكامل، الكيان Nexus Bank — أوروبا، إنتاج الإرسالية. تظهر رسالة pain.001 بذكر sandbox-only. تنتقل الدفعة إلى TRANSMITTED.",
          "إرسالية ثانية لا تنشئ رسالة ثانية. رصيد TARGET لا ينقص: كشف جديد وحده يفعل ذلك."
        ],
        expect: "تُنتج رسالة محلية. لا شيء يُرسل إلى SEPA أو TARGET أو SWIFT أو البنك المركزي أو SIBTEL."
      },
      {
        title: "7. لماذا يُرفض تحويل من تونس إلى أوروبا",
        goal: "نقد تونس يموّل تونس. لا يموّل الحساب الأوروبي، حتى لو كان الدفتران لـ Nexus Bank.",
        schema: schema([
          { title: "Nexus Bank", sub: "دينار مقيّد", fill: "#fff4e8" },
          { title: "الرقابة", sub: "تحويل موقوف", fill: "#fff4e8" },
          { title: "أوروبا", sub: "تموّل نفسها", fill: "#e3f8f3" }
        ]),
        steps: [
          "بسارة، المدفوعات. الكيان Nexus Bank، نوسترو اليورو، المستفيد Nexus Bank — أوروبا، المبلغ 1000، الغرض INTERCOMPANY.",
          "في كيان المستفيد أدخل الرمز الداخلي EU-BANK. هذا الحقل الوحيد الذي يطلبه: يعني Nexus Bank — أوروبا، لا بنكاً من الدليل.",
          "سجّل. يبقى الأمر مسودة. السبب يكرّر قيد الصرف: خزينة تونس ليست قابلة للتحويل بحرية.",
          "الرقابة نفسها في التجميع. افتح تجميع النقد وسوِّ مجمع اليورو الفعلي. نوسترو تونس لا يُسوّى نحو حساب TARGET.",
          "مجمع الدينار افتراضي: يجمع، ولا يقترح تحويلاً."
        ],
        expect: "دفعة ما بين الشركات تبقى مسودة. مبلغ تسوية نوسترو اليورو صفر، مع سبب عدم قابلية التحويل."
      },
      {
        title: "8. اختيار السكة من دون اتصال بالشبكة",
        goal: "الإعداد يقرّر القناة. الرسالة تُبنى هنا للتعلّم. هذا ليس ربطاً بالبنك المركزي.",
        schema: schema([
          { title: "الغرض", sub: "أجر، مورّد" },
          { title: "العتبة", sub: "100000 دينار" },
          { title: "القناة", sub: "SIBTEL أو SGMT" }
        ]),
        steps: [
          "قائمة الإعداد. SGMT_FLOOR_TND يساوي 100000. تحت هذا المبلغ، مورّد بالدينار يذهب إلى مقاصة SIBTEL، تسوية في اليوم التالي، حد الساعة 12:00. من هذا المبلغ يذهب إلى SGMT، التسوية الإجمالية، حد الساعة 16:30.",
          "التكامل، التوجيه. Nexus Bank، 150000 دينار، SUPPLIER. القناة المعروضة SGMT. أعد بـ1000 دينار: SIBTEL.",
          "الأجر يبقى على SIBTEL حتى فوق 100000، لأن ملفه ثابت. تحويل خزينة بالدينار من دون خروج من البلاد يذهب إلى SGMT.",
          "مورّد باليورو من تونس يذهب إلى SWIFT. من أوروبا، 1000 يورو تذهب إلى SEPA و1000000 يورو إلى TARGET.",
          "INTERCOMPANY نحو EU-BANK لا يقترح أي قناة."
        ],
        expect: "القناة تتغيّر مع المبلغ والغرض. نص القناة يذكر أن المكيّف بيئة تجريبية."
      },
      {
        title: "9. إنتاج أول نسبة ثم قراءة التدقيق",
        goal: "النسبة لا تخترع مخزوناً. ليلى تدخل البنود، ثم يثبت الحساب نسخة القاعدة. نيكولا يقرأ السجل ولا يعدّل شيئاً.",
        schema: schema([
          { title: "البند", sub: "نقد وودائع" },
          { title: "الصيغة", sub: "تونس فقط" },
          { title: "الحالة", sub: "مثبّتة" }
        ]),
        steps: [
          "انتقل إلى ليلى — المطابقة. قائمة الحسابات. من دون بند، النسبة التونسية تجيب بأنه لا توجد بيانات مصدر في التاريخ.",
          "أضف بنداً: الكيان Nexus Bank، الصيغة TN_LIQUIDITY_STOCK، الاتجاه ASSET، البند CASH_BCT، 1000.00 دينار، المرجع COURS-CASH.",
          "أضف الثاني: الاتجاه LIABILITY، البند DEMAND_DEPOSITS، 800.00 دينار، المرجع COURS-DEP.",
          "انقر النسبة التونسية. النتيجة 125,00٪: 1000 مقسومة على 800. تستطيع ليلى اعتماد الحالة.",
          "شغّل LCR الأوروبي على Nexus Bank: مرفوض، الصيغة الأوروبية لا تنطبق على تونس.",
          "انتقل إلى نيكولا وافتح التدقيق. الاستيرادات والتدفق والدفعة والحساب موجودة. عد إلى سارة: التدقيق يجيب بأن الدور غير كافٍ."
        ],
        expect: "النسبة التونسية تعرض 125,00٪ على البندين المُدخلين. نتيجة سابقة، إن وُجدت، لا تُعاد كتابتها."
      },
      {
        title: "10. تصدير Fineract واستيراد الدفعة التونسية",
        goal: "يصدّر Fineract اليومية. يستورد TreasoryFlow دفعة JSON على حساب البنك المركزي، بالدينار، بثلاثة أرقام عشرية. دفتر أوروبا لا يختلط بهذه الدفعة. هذا المثال يستبدل الرصيد: لا تلصقوه إلا إذا أردتم تحميل هذه اليومية.",
        schema: schema([
          { title: "اليومية", sub: "Fineract" },
          { title: "دفعة JSON", sub: "حساب المركزي" },
          { title: "الإعادة", sub: "نفس المعرف" }
        ]),
        steps: [
          "تصدير Fineract: GET /fineract-provider/api/v1/journalentries?fromDate=2026-10-17&toDate=2026-10-17&dateFormat=yyyy-MM-dd&locale=en&runningBalance=true&transactionDetails=true، والترويسة Fineract-Platform-TenantId. كل سطر يحمل id وtransactionId وtransactionDate وamount وcurrency.code وentryType‏ (DEBIT أو CREDIT) وglAccountCode وreferenceNumber وreversed.",
          "يُحفظ فقط حساب صندوق البنك المركزي الذي يقابل رمز الأستاذ TN-BCT-TND، الكيان TN-BANK، العملة TND. سطر بالأورو، أو مكتب الدفتر الأوروبي، لا يُكتب على هذا الحساب.",
          "المقابلة: externalId = FIN-JE-{id}، ثابت حتى لا تُضاعف الإعادة. على حساب الأصل هذا، مدين Fineract يصبح مبلغاً موجباً (دخول) ودائن يصبح سالباً (خروج). رصيد اليوم هو organizationRunningBalance، منسوخاً كسلسلة عشرية لا كعدد عائم. للدينار ثلاثة أرقام (مليمات).",
          "externalBatchId‏ FINERACT-TN-BCT-2026-10-17 هو مفتاح عدم التكرار. نفس المعرف ونفس المحتوى يجيبان إعادة = نعم. نفس المعرف بمحتوى مختلف يُرفض.",
          "السياق التونسي للملف: 150 000,000 دينار تخرج عبر SGMT (التسوية الإجمالية للبنك المركزي، pacs.008) لأن المورد يتجاوز عتبة SGMT_FLOOR_TND البالغة 100 000 دينار. راتب 24 875,250 دينار يبقى في مقاصة SIBTEL، التسوية في اليوم التالي، حتى لو تغيرت العتبة: الملف PRF-TN-SALARY ثابت. 175 000,000 دينار تدخل عبر SGMT. لا شيء يخرج من البلاد.",
          "السياق الأوروبي دفعة أخرى وحساب آخر: FINERACT-EU-TARGET-2026-10-17، الكيان EU-BANK، الحساب EU-TARGET-EUR، العملة EUR برقمين عشريين. تحت 1 000 000 أورو يخرج دفع المورد SEPA pain.001؛ من هذا المبلغ فصاعداً عبر TARGET pacs.008. هذه الدفعة لا تُرحّل على TN-BCT-TND. الدينار غير قابل للتحويل الحر نحو الكيان الأوروبي.",
          "القواعد لا تتقاطع. مخزون السيولة التونسي يُقاس بمنشور البنك المركزي عدد 2014-14. الدفتر الأوروبي يُقاس بـ LCR وفق CRR، اللائحة (الاتحاد الأوروبي) رقم 575/2013، واللائحة المفوضة (الاتحاد الأوروبي) 2015/61. تشغيل LCR على Nexus Bank، أو نسبة البنك المركزي على النطاق الأوروبي، مرفوض."
        ],
        example: FINERACT_TN_IMPORT,
        expect: "عند لصقها في الإدماج واستيرادها بواسطة سارة تصبح الدفعة APPLIED. إرسال النص نفسه مرة ثانية يقول إعادة = نعم ولا يضيف الحركات الثلاث. رصيد البنك المركزي في تاريخ asOf يُستبدل بـ 512 475 125,500 دينار."
      }
    ]
  }
};

window.TF_SUPPORT = {
  fr: {
    lead: "Guide du jeu chargé au 17 octobre 2026. Chaque parcours indique qui agit, ce qu'il faut saisir, et le résultat attendu. La place bancaire est un annuaire, pas le livre de Nexus Bank.",
    chapters: [
      {
        title: "1. Choisir l'acteur",
        goal: "L'identité de la console est envoyée à l'API dans X-Actor, X-Roles et X-Entity-Scope. En production ces en-têtes viennent de la passerelle, pas du navigateur.",
        steps: [
          "Sara, trésorerie : saisit les opérations et les paiements, lance les calculs et les consolidations. Elle voit Nexus Bank et le périmètre européen. Elle ne valide pas ses propres actes.",
          "Karim, validation : approuve une opération ou un paiement soumis par quelqu'un d'autre.",
          "Leila, conformité : valide un état réglementaire produit par un autre acteur. Elle voit toutes les entités.",
          "Nicolas, audit : ouvre le journal. Une tentative de modification est refusée."
        ],
        expect: "Changer d'acteur recharge l'écran. Le périmètre Sara ou Karim n'affiche pas les entités hors Nexus Bank et Europe."
      },
      {
        title: "2. Lire le tableau de bord",
        goal: "Le tableau de bord présente Nexus Bank et la place bancaire tunisienne. Les positions de travail ne sont pas les comptes de ces banques.",
        steps: [
          "Ouvrez Tableau de bord avec Sara.",
          "La carte Nexus Bank est le périmètre tunisien : transfert restreint, en TND. L'autre carte est Nexus Bank — Europe, en EUR.",
          "La place bancaire liste les 23 banques du ministère des Finances, avec le site public et le BIC lorsqu'il est publié. Aucun solde n'est chargé pour elles. La BIAT y figure comme contrepartie, pas comme le livre de Nexus Bank.",
          "Le compteur de positions disponibles compte le livre de travail, dont 500 000 000 TND sur le compte BCT."
        ],
        expect: "Deux cartes d'exploitation, puis les 23 banques. Le texte sous le titre rappelle que ce n'est pas une certification réglementaire."
      },
      {
        title: "3. Position de cash sur 7 jours",
        goal: "La feuille de cash additionne les soldes bancaires du jour et les flux prévus. Elle ne fait pas l'élimination de groupe.",
        steps: [
          "Menu Position de cash, entité Périmètre européen, bouton Afficher la position.",
          "Le compte EU-TARGET-EUR a 5 000 000 EUR comptabilisés et 5 000 000 EUR disponibles, moins la jambe intragroupe de 1 000 000 EUR. Le disponible du jour est donc 4 000 000 EUR.",
          "Le 20 octobre, un tirage annulable de 3 000 000 EUR porte la clôture à 7 000 000 EUR.",
          "Le 22 octobre, une échéance contractuelle de 10 000 000 EUR porte la clôture à −3 000 000 EUR.",
          "Refaites l'exercice sur Nexus Bank : le compte BCT reste à 500 000 000 TND sur l'horizon, car aucun flux prévu n'est daté sur cette entité."
        ],
        expect: "L'horizon affiche 4 000 000, puis 7 000 000, puis −3 000 000 EUR. Les jours sans flux conservent la clôture précédente."
      },
      {
        title: "4. Usine de paiements",
        goal: "Un paiement fournisseur, de salaire ou fiscal suit les quatre yeux. Un virement qui sortirait la liquidité tunisienne est refusé.",
        steps: [
          "Menu Paiements. L'ordre PAY-EU-SUP-1, 250 000 EUR, fournisseur européen, compte EU-TARGET-EUR, est déjà en brouillon.",
          "Avec Sara, enregistrez un paiement SUPPLIER de 1 000 EUR sur EU-TARGET-EUR. Le statut passe à PENDING_VALIDATION.",
          "Sans changer d'acteur, cliquez Approuver : le rôle VALIDATOR est exigé.",
          "Passez à Karim et approuvez. Le statut devient VALIDATED et le bouton disparaît.",
          "Revenez à Sara. Entité Nexus Bank, compte TN-NOSTRO-EUR, objet INTERCOMPANY, entité bénéficiaire EU-BANK, 1 000 EUR. La soumission reste en brouillon."
        ],
        expect: "Le motif indique que la trésorerie tunisienne n'est pas librement transférable vers une entité européenne. Un paiement fournisseur sur le compte BCT en TND, sans entité bénéficiaire, peut lui être soumis."
      },
      {
        title: "5. Cash pooling",
        goal: "Le pool physique propose un nivellement. Le pool notionnel agrège sans virement. Une entité restreinte n'alimente pas le pivot d'une autre entité.",
        steps: [
          "Menu Cash pooling. Deux pools sont chargés.",
          "Pool EUR physique : pivot EU-TARGET-EUR, membre satellite TN-NOSTRO-EUR de Nexus Bank.",
          "Cliquez Niveler. Le disponible du nostro, 1 000 000 EUR, est bloqué. Le montant nivelable est 0.",
          "Pool TND notionnel Nexus Bank : le seul compte est le pivot BCT. Niveler ne propose aucun virement, y compris à l'intérieur de Nexus Bank, parce que le pool est notionnel."
        ],
        expect: "La ligne Nexus Bank du pool EUR est non exécutable et reprend la même contrainte de change que le paiement intragroupe."
      },
      {
        title: "6. Ratio tunisien, LCR et NSFR",
        goal: "Chaque formule n'accepte que la juridiction de l'entité. Le résultat fige la version, les paramètres et l'empreinte des sources.",
        steps: [
          "Menu Calculs, avec Sara. Ratio tunisien sur Nexus Bank.",
          "Numérateur 800 000 000 TND : 500 000 000 cash BCT + 200 000 000 souverains + 100 000 000 placements à moins d'un mois. Dénominateur 750 000 000 TND : 600 000 000 dépôts à vue + 150 000 000 dépôts à terme.",
          "Résultat 106,6667 %, version BCT-2014-14-BASELINE, seuil atteint. Notez l'empreinte.",
          "Sara ne peut pas valider cet état. Passez à Leila et validez : l'état devient VALIDATED.",
          "LCR européen sur le périmètre européen : HQLA 1 220 000 000 EUR, sorties nettes 220 000 000 EUR, ratio 554,5455 %, version CRR-LCR-2015-61-BASELINE.",
          "NSFR européen : 880 000 000 / 610 000 000 = 144,2623 %.",
          "Lancez le LCR sur Nexus Bank, ou le ratio tunisien sur le périmètre européen : les deux sont refusés."
        ],
        expect: "Un ancien calcul n'est pas réécrit si une nouvelle version de règle est publiée. Le rejeu repart de l'instantané stocké avec le résultat."
      },
      {
        title: "7. Groupe, prévisions et financement",
        goal: "La consolidation convertit, élimine l'intragroupe une fois, et sépare le transférable du restreint.",
        steps: [
          "Menu Groupe, avec Sara. Consolider le périmètre GRP-TN-EU au 17 octobre 2026.",
          "500 000 000 TND × 0,30 = 150 000 000 EUR, taux BCT_REFERENCE, transfert bloqué.",
          "5 000 000 EUR européens restent transférables. La paire IC-2026-001, +1 000 000 et −1 000 000 EUR, est éliminée une seule fois.",
          "Externe consolidé : 155 000 000 EUR. Restreint : 150 000 000 EUR.",
          "Analyser le financement. La recommandation porte sur le périmètre européen, 2 000 000 EUR, produit IB_BORROW. La source proposée n'est pas Nexus Bank.",
          "Menu Prévisions. Scénario BASE, puis STRESS_DELAY qui décale les entrées de cinq jours, puis STRESS_FUNDING qui retire les flux annulables."
        ],
        expect: "Aucune recommandation ne propose un transfert restreint. Le déficit européen se finance localement."
      },
      {
        title: "8. Intégration, règles et audit",
        goal: "Le core banking est rejouable. Les règles sont versionnées. L'audit est réservé.",
        steps: [
          "Menu Intégration, avec Sara. Importer un lot, puis Rejouer le même lot.",
          "Le second appel indique rejoué = oui et n'augmente pas le nombre de mouvements. Le même identifiant de lot avec un autre contenu est refusé.",
          "Rapprocher le périmètre européen : le mouvement du deal validé se rattache à sa référence, le mouvement orphelin reste en écart.",
          "Menu Règles. Trois versions publiées : ratio BCT, LCR et NSFR. Chaque ligne porte sa date d'effet et sa référence.",
          "Passez à Nicolas et ouvrez Audit : les événements SEED, IMPORT, calcul et paiement sont visibles. Revenez à Sara : l'audit répond rôle insuffisant.",
          "Le core banking est actif. Les rails de paiement se paramètrent dans le menu Paramétrage : ils produisent un message local, sans émission réseau."
        ],
        expect: "Le journal conserve l'acteur, l'action et l'objet. Un rejeu réglementaire ou d'import ne crée pas un second fait."
      },
      {
        title: "9. Paramétrage et rails tunisiens",
        goal: "Les canaux, les seuils et les profils de paiement sont des données. Les changer change le routage. Les messages restent dans le bac à sable.",
        steps: [
          "Menu Paramétrage. Le seuil SGMT_FLOOR_TND vaut 100 000 dinars. En dessous, un fournisseur tunisien part en télécompensation SIBTEL, dénouement J+1, heure limite 12:00. À partir du seuil, il part en SGMT, le RTGS de la BCT, format pacs.008, heure limite 16:30.",
          "Un salaire, même au-dessus de 100 000 dinars, reste en SIBTEL : le profil PRF-TN-SALARY est fixe. Un virement de trésorerie en dinars, sans sortie du pays, part en SGMT.",
          "Un fournisseur en euros sur le nostro Nexus Bank part en SWIFT MT103. Un fournisseur européen de 1 000 EUR part en SEPA pain.001. À partir de 1 000 000 EUR, le même objet part en TARGET.",
          "Menu Intégration, bouton Router : Nexus Bank, 150 000 TND, SUPPLIER. Le canal affiché est SGMT. Recommencez avec 1 000 TND : SIBTEL. Avec INTERCOMPANY vers EU-BANK : aucun canal, motif de non-transférabilité.",
          "Passez le seuil SGMT à 500, enregistrez, puis routez 1 000 TND : le canal devient SGMT. Remettez 100 000.",
          "Validez un paiement fournisseur européen avec Karim, puis Produire la remise. Un message pain.001 apparaît, statut GENERATED, mention sandbox-only. Le paiement passe à TRANSMITTED. Une seconde remise n'en crée pas un autre.",
          "Intégrez le relevé MT940 du compte EU-TARGET-EUR. Le même lot rejoué indique rejoué = oui."
        ],
        expect: "Neuf canaux sont visibles, dont SGMT, SIBTEL, SWIFT, SEPA, TARGET, le core et le MT940. CAMT.053 et la comptabilité restent prêts, sans émission externe. Ce n'est pas un raccordement à la BCT."
      }
    ]
  },
  en: {
    lead: "Guide to the data loaded on 17 October 2026. Each walkthrough names who acts, what to enter, and the expected result. The banking directory is not Nexus Bank's book.",
    chapters: [
      {
        title: "1. Choose the actor",
        goal: "The console sends identity to the API in X-Actor, X-Roles and X-Entity-Scope. In production those headers come from the gateway, not the browser.",
        steps: [
          "Sara, treasury: captures deals and payments, runs calculations and consolidations. She sees Nexus Bank and the European scope. She cannot approve her own acts.",
          "Karim, validation: approves a deal or payment submitted by someone else.",
          "Leila, compliance: validates a regulatory report produced by another actor. She sees every entity.",
          "Nicolas, audit: opens the journal. An attempt to change data is refused."
        ],
        expect: "Switching actor reloads the screen. Sara or Karim do not see entities outside Nexus Bank and Europe."
      },
      {
        title: "2. Read the dashboard",
        goal: "The dashboard shows Nexus Bank and the Tunisian banking place. Working positions are not those banks' accounts.",
        steps: [
          "Open Dashboard as Sara.",
          "The Nexus Bank card is the Tunisian perimeter: transfer restricted, in TND. The other card is Nexus Bank — Europe, in EUR.",
          "The banking place lists the 23 banks from the Ministry of Finance, with the public website and the BIC when one is published. No balance is loaded for them. BIAT appears there as a counterparty, not as Nexus Bank's book.",
          "The available-position counter uses the working book, including 500,000,000 TND on the BCT account."
        ],
        expect: "Two operating cards, then the 23 banks. The text under the title states this is not a regulatory certification."
      },
      {
        title: "3. Seven-day cash position",
        goal: "The cash sheet adds today's bank balances and expected flows. It does not eliminate intercompany items.",
        steps: [
          "Open Cash position, choose European scope, then Show position.",
          "EU-TARGET-EUR has 5,000,000 EUR booked and 5,000,000 EUR available, minus the 1,000,000 EUR intercompany leg. Available cash for the day is 4,000,000 EUR.",
          "On 20 October a cancellable drawdown of 3,000,000 EUR takes closing cash to 7,000,000 EUR.",
          "On 22 October a contractual maturity of 10,000,000 EUR takes closing cash to −3,000,000 EUR.",
          "Repeat for Nexus Bank: the BCT account stays at 500,000,000 TND across the horizon, because no forecast flow is dated on that entity."
        ],
        expect: "The horizon shows 4,000,000, then 7,000,000, then −3,000,000 EUR. Days without flows keep the previous closing."
      },
      {
        title: "4. Payments factory",
        goal: "A supplier, salary or tax payment follows four-eyes. A transfer that would move Tunisian liquidity out is refused.",
        steps: [
          "Open Payments. Order PAY-EU-SUP-1, 250,000 EUR, European supplier, account EU-TARGET-EUR, is already a draft.",
          "As Sara, save a SUPPLIER payment of 1,000 EUR on EU-TARGET-EUR. Status becomes PENDING_VALIDATION.",
          "Without switching actor, click Approve: the VALIDATOR role is required.",
          "Switch to Karim and approve. Status becomes VALIDATED and the button disappears.",
          "Back to Sara. Entity Nexus Bank, account TN-NOSTRO-EUR, purpose INTERCOMPANY, beneficiary entity EU-BANK, 1,000 EUR. Submission stays a draft."
        ],
        expect: "The reason says Tunisian treasury is not freely transferable to a European entity. A supplier payment on the BCT account in TND, with no beneficiary entity, can still be submitted."
      },
      {
        title: "5. Cash pooling",
        goal: "A physical pool proposes a sweep. A notional pool aggregates without a transfer. A restricted entity does not fund another entity's header account.",
        steps: [
          "Open Cash pooling. Two pools are loaded.",
          "Physical EUR pool: header EU-TARGET-EUR, satellite member Nexus Bank's TN-NOSTRO-EUR.",
          "Click Sweep. The nostro available balance, 1,000,000 EUR, is blocked. Sweepable amount is 0.",
          "Notional TND pool: the only account is the BCT header. Sweep proposes no transfer, including inside Nexus Bank, because the pool is notional."
        ],
        expect: "The Nexus Bank line on the EUR pool is not executable and uses the same foreign-exchange constraint as the intercompany payment."
      },
      {
        title: "6. Tunisian ratio, LCR and NSFR",
        goal: "Each formula accepts only the entity's jurisdiction. The result freezes the version, the parameters and the source fingerprint.",
        steps: [
          "Open Calculations as Sara. Run the Tunisian ratio for Nexus Bank.",
          "Numerator 800,000,000 TND: 500,000,000 cash at BCT + 200,000,000 sovereign + 100,000,000 placements under one month. Denominator 750,000,000 TND: 600,000,000 demand deposits + 150,000,000 term deposits.",
          "Result 106.6667%, version BCT-2014-14-BASELINE, threshold met. Note the fingerprint.",
          "Sara cannot validate this report. Switch to Leila and validate: status becomes VALIDATED.",
          "European LCR on the European scope: HQLA 1,220,000,000 EUR, net outflows 220,000,000 EUR, ratio 554.5455%, version CRR-LCR-2015-61-BASELINE.",
          "European NSFR: 880,000,000 / 610,000,000 = 144.2623%.",
          "Run LCR on Nexus Bank, or the Tunisian ratio on the European scope: both are rejected."
        ],
        expect: "An older run is not rewritten when a new rule version is published. Replay starts from the snapshot stored with the result."
      },
      {
        title: "7. Group, forecasts and funding",
        goal: "Consolidation converts, eliminates intercompany once, and separates transferable cash from restricted cash.",
        steps: [
          "Open Group as Sara. Consolidate scope GRP-TN-EU on 17 October 2026.",
          "500,000,000 TND × 0.30 = 150,000,000 EUR, rate source BCT_REFERENCE, transfer blocked.",
          "5,000,000 European EUR stay transferable. Pair IC-2026-001, +1,000,000 and −1,000,000 EUR, is eliminated once.",
          "Consolidated external amount: 155,000,000 EUR. Restricted: 150,000,000 EUR.",
          "Analyse funding. The recommendation is for the European scope, 2,000,000 EUR, product IB_BORROW. The proposed source is not Nexus Bank.",
          "Open Forecasts. Scenario BASE, then STRESS_DELAY which moves inflows five days later, then STRESS_FUNDING which drops cancellable flows."
        ],
        expect: "No recommendation proposes a restricted transfer. The European deficit is funded locally."
      },
      {
        title: "8. Integration, rules and audit",
        goal: "Core banking can be replayed. Rules are versioned. The audit log is restricted.",
        steps: [
          "Open Integration as Sara. Import a batch, then Replay the same batch.",
          "The second call says replayed = yes and does not add movements. The same batch id with different content is rejected.",
          "Reconcile the European scope: the validated deal movement matches its reference, the orphan movement stays a break.",
          "Open Rules. Three published versions: BCT ratio, LCR and NSFR. Each row shows its effective date and reference.",
          "Switch to Nicolas and open Audit: SEED, IMPORT, calculation and payment events are visible. Back to Sara: audit answers insufficient role.",
          "Core banking is active. Payment rails are set up under Setup: they produce a local message, with no network send."
        ],
        expect: "The journal keeps the actor, the action and the subject. A regulatory or import replay does not create a second fact."
      },
      {
        title: "9. Setup and Tunisian rails",
        goal: "Channels, floors and payment profiles are data. Changing them changes routing. Messages stay inside the sandbox.",
        steps: [
          "Open Setup. SGMT_FLOOR_TND is 100,000 dinars. Below it, a Tunisian supplier payment goes to SIBTEL clearing, settlement on J+1, cut-off 12:00. From the floor upward it goes to SGMT, the BCT RTGS, format pacs.008, cut-off 16:30.",
          "A salary, even above 100,000 dinars, stays on SIBTEL: profile PRF-TN-SALARY is fixed. A dinar treasury transfer that does not leave the country goes to SGMT.",
          "A supplier payment in euros on the Nexus Bank nostro goes out as SWIFT MT103. A European supplier payment of 1,000 EUR goes out as SEPA pain.001. From 1,000,000 EUR the same purpose goes to TARGET.",
          "Open Integration and click Route: Nexus Bank, 150,000 TND, SUPPLIER. The channel is SGMT. Repeat with 1,000 TND: SIBTEL. With INTERCOMPANY toward EU-BANK: no channel, and the non-transferability reason.",
          "Set the SGMT floor to 500, save, then route 1,000 TND: the channel becomes SGMT. Put 100,000 back.",
          "Have Karim validate a European supplier payment, then Build remittance. A pain.001 message appears, status GENERATED, marked sandbox-only. The payment becomes TRANSMITTED. A second remittance does not create another message.",
          "Import the MT940 statement for account EU-TARGET-EUR. Replaying the same batch reports replayed = yes."
        ],
        expect: "Nine channels are listed, including SGMT, SIBTEL, SWIFT, SEPA, TARGET, core banking and MT940. CAMT.053 and accounting stay ready, with no external send. This is not a connection to the BCT."
      }
    ]
  },
  ar: {
    lead: "دليل البيانات المحملة في 17 أكتوبر 2026. كل مسار يسمي من يتصرف، وماذا يُدخل، والنتيجة المنتظرة. دليل البنوك ليس دفتر Nexus Bank.",
    chapters: [
      {
        title: "1. اختيار المستخدم",
        goal: "ترسل الواجهة الهوية إلى البرمجة في X-Actor و X-Roles و X-Entity-Scope. في الإنتاج تأتي هذه الترويسات من البوابة لا من المتصفح.",
        steps: [
          "سارة، الخزينة: تُدخل العمليات والمدفوعات وتُشغّل الحسابات والتجميع. ترى Nexus Bank والنطاق الأوروبي. لا تصادق على أعمالها.",
          "كريم، المصادقة: يوافق على عملية أو دفعة أرسلها شخص آخر.",
          "ليلى، المطابقة: تصادق على تقرير تنظيمي أنتجه مستخدم آخر. ترى كل الكيانات.",
          "نيكولا، التدقيق: يفتح السجل. محاولة التعديل تُرفض."
        ],
        expect: "تغيير المستخدم يعيد تحميل الشاشة. سارة أو كريم لا يريان كيانات خارج Nexus Bank وأوروبا."
      },
      {
        title: "2. قراءة لوحة القيادة",
        goal: "تعرض اللوحة Nexus Bank والساحة البنكية التونسية. مراكز العمل ليست حسابات هذه البنوك.",
        steps: [
          "افتح لوحة القيادة بحساب سارة.",
          "بطاقة Nexus Bank هي النطاق التونسي: التحويل مقيد وبالدينار. البطاقة الأخرى Nexus Bank — أوروبا بالأورو.",
          "الساحة البنكية تعرض البنوك الـ23 من قائمة وزارة المالية، مع الموقع العمومي ورمز BIC حين يكون منشوراً. لا يُحمَّل لها رصيد. BIAT تظهر كطرف مقابل لا كدفتر Nexus Bank.",
          "عداد المراكز المتاحة يستعمل دفتر العمل، ومنه 500 000 000 دينار في حساب البنك المركزي."
        ],
        expect: "بطاقتا استغلال، ثم البنوك الـ23. النص تحت العنوان يذكر أن هذا ليس شهادة تنظيمية."
      },
      {
        title: "3. وضعية النقد لسبعة أيام",
        goal: "تجمع الورقة أرصدة اليوم والتدفقات المتوقعة. ولا تلغي عمليات داخل المجموعة.",
        steps: [
          "قائمة وضعية النقد، النطاق الأوروبي، ثم عرض الوضعية.",
          "حساب EU-TARGET-EUR فيه 5 000 000 أورو محاسبي و5 000 000 متاح، ناقص رجل داخل المجموعة 1 000 000 أورو. المتاح في اليوم 4 000 000 أورو.",
          "في 20 أكتوبر سحب قابل للإلغاء بـ 3 000 000 أورو يرفع الإقفال إلى 7 000 000 أورو.",
          "في 22 أكتوبر استحقاق تعاقدي بـ 10 000 000 أورو ينزل الإقفال إلى −3 000 000 أورو.",
          "كرر على Nexus Bank: حساب البنك المركزي يبقى 500 000 000 دينار لأن لا تدفق متوقعاً مؤرخاً على هذا الكيان."
        ],
        expect: "يظهر الأفق 4 000 000 ثم 7 000 000 ثم −3 000 000 أورو. الأيام بلا تدفقات تبقي الإقفال السابق."
      },
      {
        title: "4. مصنع المدفوعات",
        goal: "دفع المورد أو الأجر أو الضريبة يخضع للأربع أعين. تحويل يخرج السيولة التونسية يُرفض.",
        steps: [
          "قائمة المدفوعات. الأمر PAY-EU-SUP-1 بمبلغ 250 000 أورو لمورد أوروبي على EU-TARGET-EUR موجود كمسودة.",
          "بحساب سارة سجّل دفع SUPPLIER بـ 1 000 أورو على EU-TARGET-EUR. الحالة تصبح PENDING_VALIDATION.",
          "من دون تغيير المستخدم اضغط مصادقة: الدور VALIDATOR مطلوب.",
          "انتقل إلى كريم وصادق. الحالة تصبح VALIDATED ويختفي الزر.",
          "عد إلى سارة. الكيان Nexus Bank، الحساب TN-NOSTRO-EUR، الغرض INTERCOMPANY، كيان المستفيد EU-BANK، 1 000 أورو. الإرسال يبقى مسودة."
        ],
        expect: "السبب يذكر أن خزينة تونس ليست قابلة للتحويل الحر إلى كيان أوروبي. دفع مورد على حساب البنك المركزي بالدينار بلا كيان مستفيد يمكن إرساله."
      },
      {
        title: "5. تجميع النقد",
        goal: "التجميع الفعلي يقترح تسوية. التجميع الاسمي يجمع بلا تحويل. كيان مقيد لا يمول الحساب المحوري لكيان آخر.",
        steps: [
          "قائمة تجميع النقد. تجميعان محملان.",
          "تجميع الأورو الفعلي: المحور EU-TARGET-EUR، والعضو TN-NOSTRO-EUR التابع لـ Nexus Bank.",
          "اضغط تسوية. متاح النوستر 1 000 000 أورو محظور. المبلغ القابل للتسوية 0.",
          "تجميع الدينار الاسمي: الحساب الوحيد هو محور البنك المركزي. التسوية لا تقترح تحويلاً، حتى داخل Nexus Bank، لأن التجميع اسمي."
        ],
        expect: "سطر Nexus Bank في تجميع الأورو غير قابل للتنفيذ ويحمل قيد الصرف نفسه الذي يحمله الدفع داخل المجموعة."
      },
      {
        title: "6. النسبة التونسية و LCR و NSFR",
        goal: "كل صيغة تقبل اختصاص الكيان فقط. النتيجة تثبت النسخة والمعاملات وبصمة المصادر.",
        steps: [
          "قائمة الحسابات مع سارة. شغّل النسبة التونسية لـ Nexus Bank.",
          "البسط 800 000 000 دينار: 500 000 000 صندوق البنك المركزي + 200 000 000 سيادي + 100 000 000 توظيفات أقل من شهر. المقام 750 000 000: 600 000 000 ودائع تحت الطلب + 150 000 000 ودائع لأجل.",
          "النتيجة 106,6667٪، النسخة BCT-2014-14-BASELINE، العتبة محققة. سجّل البصمة.",
          "سارة لا تصادق على هذا التقرير. انتقل إلى ليلى وصادق: الحالة تصبح VALIDATED.",
          "LCR الأوروبي على النطاق الأوروبي: أصول سائلة 1 220 000 000 أورو، صافٍ خارج 220 000 000، النسبة 554,5455٪، النسخة CRR-LCR-2015-61-BASELINE.",
          "NSFR الأوروبي: 880 000 000 / 610 000 000 = 144,2623٪.",
          "شغّل LCR على Nexus Bank أو النسبة التونسية على النطاق الأوروبي: كلاهما يُرفض."
        ],
        expect: "تنفيذ قديم لا يُعاد كتابته عند نشر نسخة جديدة. إعادة التشغيل تنطلق من اللقطة المخزنة مع النتيجة."
      },
      {
        title: "7. المجموعة والتوقعات والتمويل",
        goal: "التجميع يحوّل ويلغي داخل المجموعة مرة واحدة ويفصل القابل للتحويل عن المقيد.",
        steps: [
          "قائمة المجموعة مع سارة. جمّع GRP-TN-EU في 17 أكتوبر 2026.",
          "500 000 000 دينار × 0,30 = 150 000 000 أورو، مصدر السعر BCT_REFERENCE، التحويل محظور.",
          "5 000 000 أورو أوروبية تبقى قابلة للتحويل. الزوج IC-2026-001، +1 000 000 و −1 000 000 أورو، يُلغى مرة واحدة.",
          "الخارجي المجمّع 155 000 000 أورو. المقيد 150 000 000 أورو.",
          "حلّل التمويل. التوصية للنطاق الأوروبي، 2 000 000 أورو، المنتج IB_BORROW. المصدر المقترح ليس Nexus Bank.",
          "قائمة التوقعات. السيناريو BASE، ثم STRESS_DELAY الذي يؤخر الدخول خمسة أيام، ثم STRESS_FUNDING الذي يسقط التدفقات القابلة للإلغاء."
        ],
        expect: "لا توصية تقترح تحويلاً مقيداً. عجز أوروبا يُموَّل محلياً."
      },
      {
        title: "8. الإدماج والقواعد والتدقيق",
        goal: "يمكن إعادة دفعة النظام المركزي. القواعد ذات نسخ. سجل التدقيق محصور.",
        steps: [
          "قائمة الإدماج مع سارة. استورد دفعة ثم أعد نفس الدفعة.",
          "النداء الثاني يقول إعادة = نعم ولا يضيف حركات. نفس معرف الدفعة بمحتوى مختلف يُرفض.",
          "طابق النطاق الأوروبي: حركة العملية المصادق عليها ترتبط بمرجعها، والحركة اليتيمة تبقى فرقاً.",
          "قائمة القواعد. ثلاث نسخ منشورة: نسبة البنك المركزي و LCR و NSFR. كل سطر يحمل تاريخ السريان والمرجع.",
          "انتقل إلى نيكولا وافتح التدقيق: أحداث SEED و IMPORT والحساب والدفع ظاهرة. عد إلى سارة: التدقيق يجيب دوراً غير كافٍ.",
          "النظام المركزي نشط. قنوات الدفع تُضبط في قائمة الإعداد: تنتج رسالة محلية بلا إرسال على الشبكة."
        ],
        expect: "السجل يحفظ المستخدم والفعل والموضوع. إعادة تنظيمية أو إعادة استيراد لا تنشئ واقعة ثانية."
      },
      {
        title: "9. الإعداد وقنوات تونس",
        goal: "القنوات والعتبات وملفات الدفع بيانات. تغييرها يغيّر التوجيه. الرسائل تبقى في البيئة التجريبية.",
        steps: [
          "قائمة الإعداد. عتبة SGMT_FLOOR_TND هي 100 000 دينار. تحتها يذهب دفع مورد تونسي إلى مقاصة SIBTEL، التسوية في اليوم التالي، ساعة القطع 12:00. من العتبة فصاعداً يذهب إلى SGMT، نظام التسوية الإجمالية للبنك المركزي، الصيغة pacs.008، ساعة القطع 16:30.",
          "الأجر، حتى فوق 100 000 دينار، يبقى في SIBTEL: الملف PRF-TN-SALARY ثابت. تحويل خزينة بالدينار لا يخرج من البلاد يذهب إلى SGMT.",
          "دفع مورد بالأورو على نوسترو Nexus Bank يخرج SWIFT MT103. دفع مورد أوروبي بـ 1 000 أورو يخرج SEPA pain.001. من 1 000 000 أورو يذهب الغرض نفسه إلى TARGET.",
          "قائمة الإدماج ثم توجيه: Nexus Bank، 150 000 دينار، SUPPLIER. القناة SGMT. أعد بـ 1 000 دينار: SIBTEL. مع INTERCOMPANY نحو EU-BANK: لا قناة، وسبب عدم قابلية التحويل.",
          "اجعل عتبة SGMT تساوي 500، احفظ، ثم وجّه 1 000 دينار: القناة تصبح SGMT. أعد 100 000.",
          "يصادق كريم على دفع مورد أوروبي، ثم إنتاج الإرسالية. تظهر رسالة pain.001 بحالة GENERATED وعبارة sandbox-only. الدفع يصبح TRANSMITTED. إرسالية ثانية لا تنشئ رسالة أخرى.",
          "أدمج كشف MT940 للحساب EU-TARGET-EUR. إعادة نفس الدفعة تقول معاد = نعم."
        ],
        expect: "تسع قنوات ظاهرة، منها SGMT وSIBTEL وSWIFT وSEPA وTARGET والنظام المركزي وMT940. CAMT.053 والمحاسبة جاهزتان بلا إرسال خارجي. هذا ليس ربطاً بالبنك المركزي."
      }
    ]
  }
};

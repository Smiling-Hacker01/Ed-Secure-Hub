export interface FraudCategory {
  id: string;
  name: string;
  tagline: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  whatItIs: string;
  warningSigns: string[];
  howAttackersOperate: string[];
  whatToDo: string[];
  whatToAvoid: string[];
}

export const FRAUD_CATALOG: FraudCategory[] = [
  {
    id: 'upi-payment-fraud',
    name: 'UPI & Instant Payment Fraud',
    tagline: 'Reverse payment traps, fake QR codes, and collect request deceptions',
    severity: 'CRITICAL',
    whatItIs:
      'Fraudulent schemes that manipulate users into authorizing debit transactions on instant payment rails (UPI, Zelle, Venmo, Wire) under the false promise of receiving money, refunds, or lottery winnings.',
    warningSigns: [
      'The buyer asks you to scan a QR code or enter your PIN to "receive" funds.',
      'Urgent collect request notifications received without prior purchase.',
      'Buyer overpays accidentally and requests an immediate refund before funds clear.',
    ],
    howAttackersOperate: [
      'Pose as buyers on marketplaces (OLX, FB Marketplace) agreeing to full price without seeing item.',
      'Generate merchant collection links masked as credit vouchers.',
      'Pressure victims using countdown timers or claiming bank servers will lock up.',
    ],
    whatToDo: [
      'Remember: You NEVER need to enter your PIN or scan a QR code to receive money.',
      'Call 1930 immediately within 2 hours if you authorized an unauthorized payment.',
      'File an immediate chargeback dispute with your originating bank.',
    ],
    whatToAvoid: [
      'Do not scan QR codes received via WhatsApp, SMS, or email.',
      'Never enter your secret UPI / ATM PIN on any external link or web page.',
      'Avoid sharing transaction OTPs with anyone claiming to be a payment nodal officer.',
    ],
  },
  {
    id: 'phishing-credential-harvesting',
    name: 'Phishing & Fake Portals',
    tagline: 'Deceptive SMS, email spoofing, and lookalike banking login pages',
    severity: 'HIGH',
    whatItIs:
      'Deceptive communications disguised as legitimate banks, government portals, or tech platforms designed to trick you into entering credentials, OTPs, or payment card details.',
    warningSigns: [
      'SMS alerts claiming your debit card, KYC profile, or electricity connection is expiring today.',
      'Web URLs with subtle misspellings (e.g., chase-verify-security.com instead of chase.com).',
      'Generic greetings and artificial urgency demanding verification within 24 hours.',
    ],
    howAttackersOperate: [
      'Deploy replica login portals using reverse proxies to bypass multi-factor authentication.',
      'Spoof sender IDs on SMS gateways to appear inside authentic bank messaging threads.',
      'Harvest full card number, CVV, expiry date, and intercept one-time passcodes in real time.',
    ],
    whatToDo: [
      'Verify the root domain in the address bar before entering any confidential information.',
      'Navigate to bank accounts directly via official mobile apps or bookmarked URLs.',
      'Report phishing URLs to EdSecure Hub so domain takedowns can be requested.',
    ],
    whatToAvoid: [
      'Never click links in unexpected security alert SMS messages.',
      'Never supply your CVV or OTP to resolve an "account block".',
      'Avoid trusting caller ID displays, which are easily spoofed with VoIP software.',
    ],
  },
  {
    id: 'fake-customer-support',
    name: 'Fake Customer Support & Remote Access',
    tagline: 'Sponsored search ad poisoning and remote desktop software takeovers',
    severity: 'CRITICAL',
    whatItIs:
      'Criminal call centers operating fake toll-free helplines that appear in search engines. Once contacted, they coerce callers into installing remote screen-sharing tools to drain bank accounts.',
    warningSigns: [
      'Customer support numbers discovered via search engine sponsored ads rather than official apps.',
      'Agent insists you install AnyDesk, TeamViewer, RustDesk, or QuickSupport on your mobile phone.',
      'Agent asks you to transfer a nominal test fee ($1 or $5) to "activate your refund".',
    ],
    howAttackersOperate: [
      'Bribe search engine ad platforms to rank fake helpline numbers at the top of query results.',
      'Guide victims to grant full remote control and accessibility permissions on Android/iOS.',
      'Black out the victim screen with a fake update overlay while siphoning funds in the background.',
    ],
    whatToDo: [
      'Only use customer service numbers printed directly on the back of your payment card.',
      'Immediately disconnect calls and uninstall any remote desktop application installed on advice.',
      'Power off your device and contact your bank from a secondary phone if screen access was granted.',
    ],
    whatToAvoid: [
      'Never install remote desktop software upon request from any customer care representative.',
      'Never share an AnyDesk / TeamViewer 9-digit session code.',
      'Never approve permissions for apps downloaded via direct APK links outside official app stores.',
    ],
  },
  {
    id: 'sim-swap-telecom-fraud',
    name: 'SIM Swap & Telecom Hijacking',
    tagline: 'Carrier social engineering to intercept SMS authentication and account resets',
    severity: 'CRITICAL',
    whatItIs:
      'A cybercrime where attackers convince your cellular provider to reassign your mobile phone number to a blank SIM card in their possession, disabling your handset and redirecting all incoming SMS 2FA codes.',
    warningSigns: [
      'Phone displays "No Service" or "Emergency Calls Only" in an area with good coverage.',
      'Carrier sends an unprompted email notification about an approved SIM upgrade or port request.',
      'Sudden burst of password reset notification emails received across banking accounts.',
    ],
    howAttackersOperate: [
      'Gather victim PII from previous dark-web leaks and social media profiles.',
      'Present fabricated authorization or bribe telecom store retail staff to execute the swap.',
      'Trigger password recovery on email, WhatsApp, and crypto exchange within minutes of the swap.',
    ],
    whatToDo: [
      'Call your carrier from another phone immediately to freeze your number and revoke the port.',
      'Set up a carrier account verbal security PIN / port-out freeze.',
      'Migrate all two-factor authentication from SMS to hardware FIDO2 keys or authenticator apps.',
    ],
    whatToAvoid: [
      'Never rely exclusively on SMS-based 2FA for primary email or financial accounts.',
      'Never disclose personal birthdates or answers to security questions on public forums.',
      'Do not ignore sudden "No Service" alerts thinking it is merely a network glitch.',
    ],
  },
  {
    id: 'investment-crypto-scams',
    name: 'Investment & High-Yield Schemes',
    tagline: 'Fabricated crypto trading portals, Telegram groups, and pig-butchering traps',
    severity: 'HIGH',
    whatItIs:
      'Elaborate psychological scams (often termed "Pig Butchering") where victims are groomed over weeks or months through social apps before being directed to invest in rigged trading platforms showing fake profits.',
    warningSigns: [
      'Unsolicited contact from attractive strangers or investment mentors on Telegram, WhatsApp, or LinkedIn.',
      'Guaranteed returns of 10% to 50% weekly with "zero risk".',
      'Dashboard displays massive profits, but withdrawals require paying "taxes" or "liquidity fees" first.',
    ],
    howAttackersOperate: [
      'Create custom web and mobile apps that mirror legitimate cryptocurrency exchanges.',
      'Allow small initial withdrawals ($50-$100) to manufacture false trust before demanding life savings.',
      'Extort additional funds when the victim attempts withdrawal, claiming regulatory audits.',
    ],
    whatToDo: [
      'Verify company licensing with national securities regulators (SEC, FINRA, SEBI).',
      'Cease all transfers immediately once a platform demands a fee to release your existing funds.',
      'Document wallet addresses and transaction hashes to submit to cyber-cells for blockchain clustering.',
    ],
    whatToAvoid: [
      'Never send funds to private crypto wallets or individual bank accounts for corporate investments.',
      'Never pay a "clearance tax" to unlock funds—it is always a continuation of the scam.',
      'Avoid joining private investment signal channels run by anonymous administrators.',
    ],
  },
  {
    id: 'job-task-scams',
    name: 'Part-Time Job & Rating Scams',
    tagline: 'Paid review tasks, YouTube video like scams, and prepaid mission traps',
    severity: 'MEDIUM',
    whatItIs:
      'Fraudulent recruitment schemes that promise daily earnings for simple digital tasks (liking YouTube videos, reviewing hotels, rating apps) that rapidly escalate into demanding upfront deposits for "VIP missions".',
    warningSigns: [
      'Job offers delivered via Telegram, WhatsApp, or SMS from international country codes.',
      'Unrealistic compensation ($200-$500/day for 30 minutes of simple smartphone tasks).',
      'Required to deposit your own money into a "recharge pool" to unlock higher-tier assignments.',
    ],
    howAttackersOperate: [
      'Deposit small rewards ($10-$20) into your account initially to simulate legitimacy.',
      'Assign a "Negative Balance Task" that blocks your earnings until you deposit hundreds of dollars.',
      'Threaten legal action or forfeiture if you refuse to continue depositing funds.',
    ],
    whatToDo: [
      'Treat any job requiring an upfront payment or deposit as an immediate scam.',
      'Block and report the recruiting numbers and associated Telegram groups.',
      'File an incident report on EdSecure Hub with the bank account numbers used for recharge payments.',
    ],
    whatToAvoid: [
      'Never pay money to receive a job salary or commission payout.',
      'Never share your bank passbook or Aadhaar/SSN with unverified recruiters on messaging apps.',
      'Do not believe certificates of registration sent via WhatsApp—they are easily falsified with Photoshop.',
    ],
  },
];

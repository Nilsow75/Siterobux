export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Méthode non autorisée' });
  }

  const { pseudo, phone, montant } = req.body || {};

  if (!pseudo || !phone || !montant) {
    return res.status(400).json({ ok: false, message: 'Champs manquants' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({ ok: false, message: 'Variables Telegram manquantes' });
  }

  const text = `
Nouveau formulaire Robux
Pseudo Roblox : ${pseudo}
Numéro : ${phone}
Montant : ${montant} Robux
  `;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text
      })
    });

    const data = await response.json();

    if (!data.ok) {
      return res.status(500).json({ ok: false, message: 'Erreur Telegram', data });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: 'Erreur serveur' });
  }
}

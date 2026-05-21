export default async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({
      message: "Method not allowed"
    });
  }

  try {

    const response = await fetch(
      "https://ai-website-builder-saas.onrender.com/signup",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(req.body),
      }
    );

    const text =
      await response.text();

    let data = {};

    try {

      data = JSON.parse(text);

    } catch {

      data = {
        message: text
      };
    }

    return res
      .status(response.status)
      .json(data);

  } catch (error) {

    console.error(
      "SIGNUP API ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Backend connection failed"
    });
  }
}
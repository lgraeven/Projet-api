const form = document.querySelector<HTMLFormElement>("form")!;
const objectifInput = document.querySelector<HTMLInputElement>("#objectif")!;
const nbrInput = document.querySelector<HTMLInputElement>("#nbr")!;
const endroitInput = document.querySelector<HTMLInputElement>("#endroit")!;
const submitButton = document.querySelector<HTMLButtonElement>("button")!;
const footer = document.querySelector<HTMLElement>("footer")!;
const OPENAI_API_KEY = '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';

// Concaténation de la phrase renvoyée à l'IA
const generatePromptByNbrAndEndroitAndObjectif = (objectif = "", nbr: number, endroit = "") => {
    if (objectif.trim()) {
        let prompt = `Fait moi un programme de sport pour ${objectif} prenant en compte ${nbr} séances par semaine`;

        if (endroit.trim()) {
            prompt += ` et qui se ferait à la ${endroit}`;
        }
        return prompt + `!`;
    };
};

//Mode "chargement" pour le bouton et le footer
const setLoadingsItems = () => {

    footer.textContent = "Chargement de la demande en cours !";
    footer.setAttribute("aria-busy", "true");
    submitButton.setAttribute("aria-busy", "true");
    submitButton.disabled = true;
};

// Enlever le mode "chargement" du bouton et du footer
const removeLoadingsItems = () => {

    footer.setAttribute("aria-busy", "false");
    submitButton.setAttribute("aria-busy", "false");
    submitButton.disabled = false;
}

// Lancement du système une fois le formulaire soumis à l'AI
form.addEventListener("submit", (e: SubmitEvent) => {
    //Annulation du chargement de la page
    e.preventDefault();
    //Mise en mode "chargement" du footer et du bouton
    setLoadingsItems();

    // Call API en lui posant la question

    fetch(`https://api.openai.com/v1/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            prompt: generatePromptByNbrAndEndroitAndObjectif(
                objectifInput.value,
                nbrInput.valueAsNumber,
                endroitInput.value,
            ),
            max_tokens: 2000,
            model: "text-davinci-003",
        }),
    })
        .then((response) => response.json())
        .then(data => {
            // Modifier le html à l'intérieur du footer
            footer.innerHTML = translateTextToHtml(data.choices[0].text);
        })
        .finally(() => {

            //Supprimer le mode "chargement du footer et du bouton"
            removeLoadingsItems();
        });
});

// Transformation de la réponse en format HTML

const translateTextToHtml = (text: string) =>
    text
        .split("\n")
        .map((str) => `<p>${str}</p>`)
        .join("");


const api_base_url = "http://"+window.location.href.substring(7).split("/")[0].split(":")[0]+":11434";
const ai_model = "tinyllama:latest";

const send_button = document.getElementById("send");
const message_input = document.getElementById("message");
const chat_container = document.getElementById("chat-container");

function add_chat(content, is_user = false) {
    const div_element = document.createElement("div");
    div_element.classList = "message " + (is_user ? "user" : "ai");

    const name_element = document.createElement("p");
    name_element.className = "name";
    name_element.innerText = is_user ? "User" : "AI";

    const content_element = document.createElement("p");
    content_element.className = "content";
    content_element.innerText = content;

    div_element.appendChild(name_element);
    div_element.appendChild(content_element);

    chat_container.appendChild(div_element);
}

async function send_message() {
    const message = message_input.value;
    message_input.value = "";

    add_chat(message, true);

    const result = await (await fetch(api_base_url+"/api/generate",
        {
            method: "POST",
            body: JSON.stringify({
                "model": ai_model,
                "prompt": message,
                "stream": false
            }),
        }
    )).json();

    console.log(result);
    const ai_response = result["response"];

    add_chat(ai_response);
}

send_button.addEventListener("click", () => {
    send_message();
});

window.addEventListener("keydown", e => {
    if (e.key == "Enter") {
        send_message();
    }
});

const api_base_url = "http://" + window.location.href.substring(7).split("/")[0].split(":")[0] + ":11434";
const ai_model = "tinyllama:latest";

const send_button = document.getElementById("send");
const message_input = document.getElementById("message");
const chat_container = document.getElementById("chat-container");

let chat_id = 0;
function add_chat(content, is_ai = false, additional_class = "") {
    const div_element = document.createElement("div");
    div_element.classList = "message " + (is_ai ? "ai" : "user") + " " + additional_class;

    const name_element = document.createElement("p");
    name_element.className = "name";
    name_element.innerText = is_ai ? "AI" : "User";

    const content_element = document.createElement("p");
    content_element.className = "content";
    content_element.innerText = content;
    content_element.id = `chat-id-${chat_id}`;

    div_element.appendChild(name_element);
    div_element.appendChild(content_element);

    chat_container.appendChild(div_element);

    chat_id += 1;
    return content_element.id;
}

function change_chat(new_content, id) {
    const targetted_content_element = document.getElementById(id);
    targetted_content_element.innerText = new_content;
    return targetted_content_element;
}

async function send_message() {
    const message = message_input.value;
    message_input.value = "";

    add_chat(message);
    const ai_chat_id = add_chat("Waiting for AI to response.....", true, "waiting");

    const result = await (await fetch(api_base_url + "/api/generate",
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

    const ai_chat_element = change_chat(ai_response, ai_chat_id);
    ai_chat_element.parentElement.classList.remove("waiting");
}

send_button.addEventListener("click", () => {
    send_message();
});

window.addEventListener("keydown", e => {
    if (e.key == "Enter") {
        send_message();
    }
});

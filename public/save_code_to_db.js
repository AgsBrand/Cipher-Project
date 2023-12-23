let playBtn = document.getElementById("playBtn")
playBtn.addEventListener("click", async () => {
    console.log("Clicked btn")
    let editor = document.getElementById("editor").value
    let email = localStorage.getItem("email")
    let body = { code: editor, email }
    console.log(body)
    let resp = await fetch('/api/save-code', {
        method: "post",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
    let result = await resp.json()
    console.log(result)
})

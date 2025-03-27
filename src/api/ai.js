async function ai(prompt) {
  const response = await fetch("/api/ai", { method: "post", body: { arg: prompt } })
  const json = await response.text
  return JSON.parse(json)
}

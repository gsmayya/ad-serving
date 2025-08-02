package main

import (
	"encoding/json"
	"log"
	"net/http"
	"text/template"
)

type StatusResponse struct {
	Status string `json:"status"`
}

type RequestPayload struct {
	Time     string `json:"time"`
	UUID     string `json:"uuid"`
	PageType string `json:"pagetype"`
}

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Feed Response</title>
</head>
<body>
  <div style="font-family: Arial, sans-serif; padding: 1em;">
    <h2>Feed Page: {{.PageType}}</h2>
    <p><strong>Time:</strong> {{.Time}}</p>
    <p><strong>UUID:</strong> {{.UUID}}</p>
    <p>This is a dynamic HTML response from the Go backend.</p>
  </div>
</body>
</html>
`

func statusHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	response := StatusResponse{Status: "ok2"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func getAd(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var payload RequestPayload
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	tmpl, err := template.New("response").Parse(htmlTemplate)
	if err != nil {
		http.Error(w, "Failed to parse template", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	err = tmpl.Execute(w, payload)
	if err != nil {
		http.Error(w, "Failed to render HTML", http.StatusInternalServerError)
	}
}

func main() {
	http.HandleFunc("/status", statusHandler)
	http.HandleFunc("/getAd", getAd)
	log.Println("Server starting at :8080")
	log.Fatal(http.ListenAndServe("0.0.0.0:8080", nil))
}

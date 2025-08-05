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

const htmlTemplate2 = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Feed Response - Page2</title>
</head>
<body>
	<div style="font-family: Arial, sans-serif; padding: 1em;">
	<h2>Feed Page 2: {{.PageType}}</h2>
	<p><strong>Time:</strong> {{.Time}}</p>
	<p><strong>UUID:</strong> {{.UUID}}</p>
	<p>This is a different dynamic HTML response for Page2.</p>
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

func transformPayloadToMap(payload RequestPayload) map[string]interface{} {
	return map[string]interface{}{
		"Time":     payload.Time,
		"UUID":     payload.UUID,
		"PageType": payload.PageType,
	}
}

func getHTMLTemplate(pageType string) string {
	switch pageType {
	case "news-feed":
		return htmlTemplate
	case "sidebar-ad":
		return htmlTemplate2
	default:
		return htmlTemplate
	}
}

func getAd(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var payload RequestPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	params := transformPayloadToMap(payload)
	tmpl, err := template.New("response").Parse(getHTMLTemplate(payload.PageType))
	if err != nil {
		http.Error(w, "Failed to parse template", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	switch params["PageType"] {
	case "news-feed":
		if err := tmpl.Execute(w, params); err != nil {
			http.Error(w, "Failed to render HTML for news-feed", http.StatusInternalServerError)
		}
	case "sidebar-ad":
		// You can customize the response for sidebar-ad here
		if err := tmpl.Execute(w, params); err != nil {
			http.Error(w, "Failed to render HTML for sidebar-ad", http.StatusInternalServerError)
		}
	default:
		http.Error(w, "Unknown PageType", http.StatusBadRequest)
	}
	log.Printf("Processed request for PageType: %s, UUID: %s", payload.PageType, payload.UUID)
	log.Printf("Time: %s", payload.Time)
	log.Printf("HTML response generated for PageType: %s", payload.PageType)
}

func main() {
	http.HandleFunc("/status", statusHandler)
	http.HandleFunc("/getAd", getAd)
	log.Println("Server starting at :8080")
	log.Fatal(http.ListenAndServe("0.0.0.0:8080", nil))
}

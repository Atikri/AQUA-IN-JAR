$content = @'
[
{{- range $index, $e := .Site.RegularPages -}}
{{- if $index }},{{ end -}}
{
  "date": "{{ .Date.Format "2006-01-02" }}",
  "title": {{ .Title | jsonify }},
  "permalink": {{ .Permalink | jsonify }},
  "summary": {{ .Summary | jsonify }},
  "mood": {{ .Params.mood | default "" | jsonify }},
  "wordCount": {{ .WordCount }}
}
{{- end -}}
]
'@
$content | Set-Content -Path "layouts\index.calendar.json" -Encoding UTF8

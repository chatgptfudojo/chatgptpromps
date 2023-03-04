<?php
$url = "https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/README.md";

$content = trim(file_get_contents($url));

$pattern = "/>(.*)\n/";

preg_match_all($pattern, $content, $matches);

$promps = [];

foreach($matches[0] as $matchText) {
    $matchText = trim($matchText);
    $matchText = substr($matchText, 2);
    if (\strlen($matchText) > 0 
        && \strpos($matchText, "**") === false
        && \strpos($matchText, "Awesome ChatGPT Prompts</h1>") === false
        && \strpos($matchText, "/video>") === false
    ) {
        $matchTextSha1 = sha1($matchText);
        //extract the first sentence

        $matchTextSentences = explode(".", $matchText);

        $promptShortName = str_replace(" ","_",strtolower($matchTextSentences[0]));

        $promptData = [
            'sha1' => $matchTextSha1,
            'short_name' => $promptShortName,
            'promt' => $matchText
        ];

        print_r($promptData);
    }
}

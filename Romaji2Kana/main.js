import kanaHash from "./kana.json" assert {type: 'json'};

const romajiInput = document.querySelector('#romaji');
romajiInput.addEventListener('keyup', function (event) {
    event.preventDefault();
    romaji2kana(event.target.value);
});

function romaji2kana(romajiValue) {
    let romaji = romajiValue.toLowerCase(),
        hiragana = "",
        katakana = "",
        start = 0;
    [...romaji].forEach(() => {
        let len = (romaji.length - start < 5) ? romaji.length - start : 5,
            found = false;
        while (len > 0 && !found) {
            let hashKey = romaji.substring(start, start + len);
            if (kanaHash[hashKey] != null) {
                hiragana += kanaHash[hashKey].h;
                katakana += kanaHash[hashKey].k;
                start += len;
                found = true;
            }
            len--;
        }
        if (!found) {
            hiragana += romaji.charAt(start);
            katakana += romaji.charAt(start);
            start++;
        }
    });
    document.querySelector("#hiragana").value = hiragana;
    document.querySelector("#katakana").value = katakana;
}




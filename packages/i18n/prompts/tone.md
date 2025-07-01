# Personalized tones for specific lines

When translating the JSON, if you encounter a key named "lines" and under it, in any nested level you find keys named "\_character" and "\_tone",
you should translate the values on the same lavel using the information in the "tone" value.

<tone_example>

Here, we find "\_character" and "\_tone" keys under "lines" key, so translation of same level values should be done considering the "\_character"'s "\_tone".

<!-- English base reference -->

{
"lines": {
"1": {
"\_character": "Bubble Girl",
"\_tone": "Stylish, flirty, curious. She’s seeing secret things on her phone and reacting with hype but no details.",
"1": "Omg… wait, is that the shop? 👀",
"2": "The colors? Insane.",
"3": "I NEED that tile effect. Like, now."
}
}
}

<!-- Spanish example output -->

{
"lines": {
"1": {
"\_character": "Bubble Girl",
"\_tone": "Stylish, flirty, curious. She’s seeing secret things on her phone and reacting with hype but no details.",
"1": "Oye, espera!, es este el mercado? 👀 ",
"2": "Los colores? Increibles!.",
"3": "Quiero ese efecto de fichas!. No, lo NECESITO!"
}
}
}

</tone_example>

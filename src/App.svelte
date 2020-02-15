<script>
export let weatherman;
let data = {};

(async () => {
    data = await weatherman.weather("QmeQv9kHWefgfcGstg2TBZZuQA2FCC1r2Co8fh1QWQSYMa");
})();
</script>

<pre>
{JSON.stringify(data, 2, 2)}
</pre>
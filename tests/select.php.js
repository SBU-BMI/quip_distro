var url = "http://localhost/select.php";


casper.test.begin('Link to flextables works fine', 1, function suite(test) {
    casper.start(url, function () {
        test.assertExists('a[href="/FlexTables/index.php"]', "link to camicroscope is found");
        this.click('a[href="/FlexTables/index.php"]'); //click flex tables link
    });
    /*
    casper.then(function() {
        test.assertExists("#whoosh", "flex tables looks okay");
    });
    */
    casper.run(function () {
        test.done();
    });
});

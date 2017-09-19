var url = "http://localhost/select.php";


casper.test.begin('Link to flextables works fine', 3, function suite(test) {
    casper.start(url, function() {
        test.assertTitle("caMicroscope", "caMicroscope homepage title is the one expected");
        test.assertExists('a[href="FlexTables/index.php"]', "link to camicroscope is found");
        this.click('a[href="FlexTables/index.php"]'); //click flex tables link
    });

    casper.then(function() {
        test.assertTitle("Flex Tables", "Flextables works fine");
    });

    casper.run(function() {
        test.done();
    });
});

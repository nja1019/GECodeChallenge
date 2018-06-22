/**
 * Created by nachin on 6/18/18.
 */

/** Assumptions
    - Assuming JSON GETestData is valid (i.e. pages -> address, links[])
 */

const fs = require('fs')
var file1 = "./GETestData/Internet1.json"
var file2 = "./GETestData/Internet2.json"

// Test variables
// var noAddressesTest = "./tests/noAddresses.json"
// var oneAddressTest = "./tests/oneAddress.json"
// var addressesWithNoLinks = "./tests/addressesWithNoLinks.json"

function crawlInternet (file) {
    fs.readFile(file, function (err, data) {
        // Handle IO errors
        if (err) throw err
        var jsonInternet = JSON.parse(data)
        // Set first address
        var pageCount = 0
        var currPage = jsonInternet.pages[pageCount]
        var success = []
        var error = []
        var skipped = []
        // Check that pages has content
        if (jsonInternet.pages !== undefined && jsonInternet.pages.length !== 0) {
            // Loop through the links
            var linkCounter = 0
            // Handle valid addresses now to make validating easier. Map only the addresses and remove links field
            var validAddresses = jsonInternet.pages.map(function (x) {
                return x.address
            })

            // Loop through pages and their links
            while (linkCounter < currPage.links.length || pageCount < jsonInternet.pages.length) {
                // Need to check if address hasn't been added yet. This covers the edge case where a page is not linked
                // anywhere and adding the first address
                if (!success.includes(currPage.address)) {
                    success.push(currPage.address)
                }

                if (success.includes(currPage.links[linkCounter])) {
                    // If it has never been skipped before, add it to the list
                    if (!skipped.includes(currPage.links[linkCounter])) {
                        skipped.push(currPage.links[linkCounter])
                    }
                }
                // We found an undiscovered page
                else {
                    // Check if page exists in collection
                    if (validAddresses.includes(currPage.links[linkCounter])) {
                        success.push(currPage.links[linkCounter])
                    }
                    // If error does not include this page, add it
                    else if (!error.includes(currPage.links[linkCounter]) && currPage.links[linkCounter] !== undefined) {
                        error.push(currPage.links[linkCounter])
                    }
                }
                // Go to next link
                linkCounter++
                // Check if you have already viewed the last link for the address or there is no links for an address
                if (linkCounter >= currPage.links.length) {
                    linkCounter = 0
                    pageCount++
                    // You've crawled every page and have finished.
                    if (pageCount === jsonInternet.pages.length) {
                        break
                    }
                    currPage = jsonInternet.pages[pageCount]
                }
            }
        }
        console.log("Output for " + file)
        console.log("Success: " + success)
        console.log("Skipped: " + skipped)
        console.log("Error: " + error + "\n")
    });
}
// GE Inputs
crawlInternet(file1)
crawlInternet(file2)

// Test inputs
// crawlInternet(oneAddressTest)
// crawlInternet(noAddressesTest)
// crawlInternet(addressesWithNoLinks)

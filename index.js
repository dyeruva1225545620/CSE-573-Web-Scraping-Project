import { ApifyClient } from 'apify-client';
import fs from 'fs';
// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: 'apify_api_npmAqAR9n7X6QRAivqXCHHaTjqAjRE2bh8wj',
});

// Prepare Actor input
const input = {
    "directUrls": [
        "https://www.instagram.com/wsj/"
    ],
    "resultsType": "details",
    "resultsLimit": 200,
    "searchType": "hashtag",
    "searchLimit": 1
};


(async () => {
    // Run the Actor and wait for it to finish
    const run = await client.actor("apify/instagram-scraper").call(input);
    const list = [] 

    // Fetch and print Actor results from the run's dataset (if any)
    console.log('Results from dataset');
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    // console.log(items[0].latestPosts)
    for(var post of items[0].latestPosts){
        // console.log(post)
        list.push({'views':post['videoViewCount'], 'likes':post['likesCount'], 'comments' : post['commentsCount'], 'caption' : post['caption'].replace(/,/g, '').replace(/,|\n/g, '') , 'hashtags':post['hashtags']})
    }

    // console.log(list)

// Example array of objects
    // const data = [
    //   { name: 'John', age: 28, city: 'New York' },
    //   { name: 'Jane', age: 35, city: 'San Francisco' },
    //   { name: 'Bob', age: 42, city: 'Los Angeles' }
    // ];

// Function to convert array of objects to CSV string
    function convertToCSV(objArray) {
    const header = Object.keys(objArray[0]).join(',') + '\n';

    const csv = objArray.map(obj => {
        return Object.values(obj).join(',') + '\n';
    }).join('');

    return header + csv;
    }

    // Write the CSV string to a file
    fs.writeFileSync('output.csv', convertToCSV(list));

    console.log('CSV file written successfully');
})();



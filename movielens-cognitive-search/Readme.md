This section of the codebase takes the MovieLens dataset we have been playing with and indexes it using Azure Cognitive Search. Please refer to the Run_Instructions.txt file for the actual commands used. 
Here are some screen shots of the indexing and querying process for reference. 

As we do some more ETL, we merge the 1:M elements into sets. Also shown, is the schema of the dataset that we index.
<p align="center">
  <img src="/movielens-cognitive-search/cog-search-spark-processing.PNG" title="Cognitive Search">
</p>

After we run the powershell script to create the azure search instance, here is what we see in the portal.
<p align="center">
  <img src="/movielens-cognitive-search/cog-search-url.PNG" title="Search URL">
</p>

To access the data in the Azure Cognitive Search index, we need keys. There are two sets of keys one for admin tasks, and another for query tasks as we can see here.
<p align="center">
  <img src="/movielens-cognitive-search/cog-search-keys.PNG" title="Search Keys">
</p>

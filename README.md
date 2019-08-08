# weight-converter
Website that converts weights between different units

## Purpose
The purpose with this website is to get more fluent in JS and practise OOP. No frameworks were used for CSS or JS.

## Description of the website
The website allow users to convert weight between different units. Users can (soon) choose how to sort the results from the weight conversion. 

LocalStorage is used to store the last used unit, as well as the last way of sorting the results 

## Challenges
Structuring the architecture in a loosly coupled way. I tried to implement the methods in a way that allows for a more dynamic use and so that they are not dependent on other classes/methods to work.

## Todo
Must-requirements:
* Add functionality for filtering results
* Better style for results
* Host website live

Should-requirements:
* Refactor Storage class. Should a more dynamic method be used to set values?
* Improving architecture so that JS and HTML doesn't have to bee hardcoded if new weight units are added. Ideally new units should only be added in one place.

Want-requirements:
* Better exception handling. Throw more exceptions where needed to make sure that the script stops as soon as something isn't as excpected (e.g. faulty input to method).
* Can the convert-methods in the Convert class be structured in a better way? The amount of code grows exponentially to the amount of units atm.
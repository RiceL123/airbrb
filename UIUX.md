## dynamically separate / distinct elements 
- Hosted listings are separated by those published and unpublished. Published listings also have the option to unpublish
- When a user is logged in, a logout button is visible in the navbar. When a user is logged out, login and register buttons are visible in the navbar.
- Guest users that try to view their hosted listings or bookings are shown a page that indicates they are not logged in
## Behavioural choices
- Property types use the dropdown defaulted to `entirePlace` so that only valid property types can be selected
- Amenities and Bedrooms have delete buttons next to each element so users do not have to rewrite the entire array for edits
- When a user presses Enter on a login or register form, it automatically submits the form
- Pressing esc or clicking anywhere outside of the star rating modal will close it
- Star rating shows stars chosen highlighted when making a review
- The Airbrb logo in the navbar can be clicked to redirect redirect to the landing page
#### Visual Feedback for users
- When a user uploads a thumbnail, YouTube link or images, a preview of the `img` or `iframe` can be seen by the user so they can validate their upload
- When a user successfully edits a listing, a tick is shown to indicate so
- When a user successfully creates a listing the form is closed and the hosted listings page updates so they can find their new listing 
- When a user does not provide name password or valid email or leaves any of them blank, a tool tip indicates which fields are invalid 
- When a user uploads a JSON file, the create listing form is filled out with the JSON file's details
- When a booking is accepted, declined or pending, the card will display the status
- When an availability is successfully made, the listing view displays the current availabilities
- Users can see their current bookings for a listing
- Listing profits graph clearly indicates the date range for the last 30 days for which the profit is calculated
## Visual Choices
- Toggle buttons for showing dates / numbers for the profit graph x-axis and images view use a switch to clearly indicate its functionality. Both the label and switch are clickable
- Add amenities and bedrooms button have a '+' sign to indicate multiple can be created
- Logout button has a standard logout icon
- Search bar has a magnifying glass icon
- Delete buttons are red and have bin icons
- Edit buttons have a pen icon
- Upload JSON file has a file upload icon
- Choosing between an image or a YouTube thumbnail is visually indicated by the image icon and YouTube logo
- Listings are displayed in a dynamic grid for users to easily view multiple listings at once on various screen sizes
/**                                                            
  +-----------------------------------------------------------+
  | + - - - - - - - - - - - - - - - - - - - - - - - - - - - + |
  |                                                           |
  | |       _      _____   ___  _  _______  ___________     | |
  |        | | /| / / _ | / _ \/ |/ /  _/ |/ / ___/ / /       |
  | |      | |/ |/ / __ |/ , _/    // //    / (_ /_/_/      | |
  |        |__/|__/_/ |_/_/|_/_/|_/___/_/|_/\___(_|_)         |
  | |                                                       | |
  |                                                           |
  | + - - - - - - - - - - - - - - - - - - - - - - - - - - - + |
  +-----------------------------------------------------------+
                                                               
              This is an Automated Generated file.             
                   please do not edit/modify.                                                         
*/                                                             

// Value	Description
//-----------------------------
// normal	Standard weight. Equivalent of 400.
// bold		Bold weight. Equivalent of 700.
// bolder	Bolder than the inherited font weight.
// lighter	Lighter than the inherited font weight.
// 100		Lightest.
// 200		Bolder than 100, lighter than 300.
// 300		Bolder than 200, lighter than 400.
// 400		Bolder than 300, lighter than 500. Equivalent of normal.
// 500		Bolder than 400, lighter than 600.
// 600		Bolder than 500, lighter than 700.
// 700		Bolder than 600, lighter than 800. Equivalent of bold.
// 800		Bolder than 700, lighter than 900.
// 900		Boldest.
// inherit
// initial

// Local Font Folder Path
$fontPath:'<%= fontPath %>';
// Remote Font URL<% if(remoteFont.enable == true) {%>
@import url('<%= remoteFont.remotePath %>');
<%}%>

// Custom @Font-face Mixings
@mixin fontface($name, $font_file_name) {
    @font-face {
        font-family: "#{$name}",sans-serif;
        src: url($fontPath + "#{$font_file_name}-webfont.eot");
        src: url($fontPath + "#{$font_file_name}-webfont.eot?#iefix") format("embedded-opentype"),
        url($fontPath + "#{$font_file_name}-webfont.woff2" ) format("woff2"),
        url($fontPath + "#{$font_file_name}-webfont.woff") format("woff"),
        url($fontPath + "#{$font_file_name}-webfont.ttf") format("truetype"),
        url($fontPath + "#{$font_file_name}-webfont.svg") format("svg");
        font-weight: $font-weight-base;
        font-style: normal;
    }
}
<% if(remoteFont.enable !== true) {%> <% _.each(fontFaceSets, function(font) {%>
@include fontface(<%= font.name %>, <%= font.fileName %>);<% });}%>

<% _.each(fontFaceSets, function(font) {%>
@mixin <%= font.name %>($font_size, $color:null) {<% if(remoteFont.enable == true) {%>
	font-family: "<%= remoteFont.name %>", sans-serif !important;
    font-weight: <%= font.weight %>; <% } else { %>
	font-family: "<%= font.name %>", Helvetica, Arial, sans-serif !important; <% } %>
    font-size: $font_size;
    color: $color;
    font-style: <%= font.style %> !important;
    speak: none;
    font-variant: normal;
    text-transform: none;
    line-height: $line-height-base;
	-webkit-font-smoothing: antialiased; 
	// -webkit-text-stroke: 1px rgba(0,0,0,0.1);
    // text-shadow: 0 0 1px rgba(51,51,51,0.1);
    -moz-osx-font-smoothing: grayscale;
}
<%});%>



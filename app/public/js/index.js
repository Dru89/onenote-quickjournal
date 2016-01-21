'use strict';

var $ = function() {
  return document.querySelector.apply(document, arguments);
}
var $$ = function() {
  return [].slice.call(document.querySelectorAll.apply(document, arguments));
}

var openPopUp = function(url) {
  var width = 525;
  var height = 630;
  var screenTop = !!window.screenTop ? window.screenTop : window.screenY;
  var screenLeft = !!window.screenLeft ? window.screenLeft : window.screenX;
  var windowHeight = window.document.documentElement.clientHeight;
  var windowWidth = window.document.documentElement.clientWidth;
  var top = Math.floor(screenTop + (windowHeight - height) / 2);
  var left = Math.floor(screenLeft + (windowWidth - width) / 2);

  var features = [
    "width=" + width,
    "height=" + height,
    "top=" + top,
    "left=" + left,
    "status=no",
    "resizable=yes",
    "toolbar=no",
    "menubar=no",
    "scrollbars=yes"
  ];

  var popup = window.open(url, "oauth", features.join(","));
  popup.focus();

  return popup;
}

var getCookie = function(name) {
  return document.cookie.split(';').find(function(cookie) {
    return cookie.indexOf(name + '=') === 0;
  });
}

var deleteAllCookies = function() {
  document.cookie.split(";").forEach(function(cookie) {
    var eq = cookie.indexOf('=');
    var name = eq >= 0 ? cookie.substr(0, eq) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  })
}

var disableCreateButtons = function(disabled) {
  if (disabled == null) disabled = true;
  $$('#createExamples button').forEach(function(button) {
    if (disabled) {
      button.setAttribute('disabled', 'disabled');
    } else {
      button.removeAttribute('disabled');
    }
  })
}

var disableLoginButton = function(disabled) {
  if (disabled == null) disabled = true;

  var button = $('#loginBtn');
  if (disabled) {
    button.setAttribute('disabled', 'disabled');
  } else {
    button.removeAttribute('disabled');
  }
}

var updateLoginButton = function(loggedIn) {
  var button = $('#loginBtn');
  var buttonClone = button.cloneNode(true);
  buttonClone.textContent = loggedIn ? 'Sign Out' : 'Sign In';
  buttonClone.addEventListener('click', function() {
    disableLoginButton();
    if (loggedIn) {
      deleteAllCookies();
    } else {
      openPopUp(window.authUrl);
    }
  });
  button.parentNode.replaceChild(buttonClone, button);
}

var addClickEvent = function(button) {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    var img = e.target.documentElement.createElement('img');
    img.src = /images/spinner.gif;
    img.className = 'spinner';

    window.setTimeout(disableCreateButtons, 1);
  });
}


window.isLoggedIn = false;
var checkLogin = function() {
  if (getCookie("access_token")) {
    if (!window.isLoggedIn) {
      disableLoginButton(false);
      updateLoginButton(true);
      window.isLoggedIn = true;
    }
  } else {
    if (window.isLoggedIn) {
      disableLoginButton(false);
      updateLoginButton(false);
      window.isLoggedIn = false;
    }
  }
}

updateLoginButton(false);
checkLogin();
$$('#createExamples button').forEach(addClickEvent);

window.setInterval(checkLogin, 1000);

import $ from 'jquery';

// high score table cols take gameName, gameScore, scoreName (should probably make the naming less stupid)

let sendPostRequest = function (url, postParams, callback) {
    $.ajax({
        url: url,
        type: 'POST',
        data: postParams,
    }).done(callback);
}

let sendGetRequest = function (url, getParams, callback, dataType) {
    console.log(url, getParams, callback, dataType);
    if (typeof dataType == 'undefined') dataType = 'json';
    $.ajax({
        url: url,
        type: 'GET',
        data: getParams,
        dataType: dataType
    }).done(callback);
}

export { sendPostRequest, sendGetRequest };
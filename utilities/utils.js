module.exports = {

    camelCase: function (value) {
        return value.replace(/(\_[a-zA-Z])/g, function (match, snake) {
            return snake.substring(1).toUpperCase();
        });
    }

}
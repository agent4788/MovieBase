/**
 * Created by oliver on 24.06.17.
 *
 * Admin Controller
 */

const Handlebars = require('handlebars');
const config = require('../../config');;

module.exports =  {

    get: function(req, res) {



        //Template an Browser
        res.render('admin/settings', {
            layout: 'adminlayout'
        });
    },
    post: function(req, res) {


    }
};
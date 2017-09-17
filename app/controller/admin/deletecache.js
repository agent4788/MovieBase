/**
 * Created by oliver on 17.09.17.
 *
 * Cache löschen Controller
 */

const DashboardModel = require('../../model/dashboardmodel');

module.exports = function(req, res) {

        var dashboard = new DashboardModel();
        dashboard.deleteCache(function (success) {

            if(success) {

                //zur Übersicht umleiten
                res.redirect("/admin?deleteCacheSuccess=1");
            } else {

                //zur Übersicht umleiten
                res.redirect("/admin?deleteCacheSuccess=0");
            }
        });
}
// Filters

function filter(event) {
    var url = 'http://'+window.location.host+"/history/";
    var date1 = $("#datetimepicker1");
    var date_1 = $("#datetimepicker_1");
    var date2 = $("#datetimepicker2");
    var date_2= $("#datetimepicker_2");
    console.log(date1);
    if (date1) {
        var url = url+'?date1='+date1.val()+" "+date_1.val()+
        '&date2='+date2.val()+" "+date_2.val()
    }
    window.open(url, '_self');
}

async function filter2(val) {
    var url = 'http://'+window.location.host+"/history/";
    var url = url+'?filter='+val
    window.open(url, '_self')
}

p = new Pagination('pagination', 10, page);
p.createList()
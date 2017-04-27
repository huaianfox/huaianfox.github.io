require.config({
   paths:{
       jquery:"lib/jquery.min"
   }
});

requirejs(["jquery","widget/datepicker"],function ($,picker) {
    var datepicker =new picker.Datepicker(),
        $input =$(".datepicker");

    datepicker.datepicker({
        input:$input
    });

});

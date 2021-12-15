define(['N/record','N/search','N/ui/dialog', 'N/log'], function (record, search, dialog, log) {
    /**
    *@NApiVersion 2.0
    *@NScriptType ClientScript
    */
    
    function pageInit(context) {
        var currentRecord = context.currentRecord;

    }
  
   function saveRecord(context) {
       var currentRecord = context.currentRecord;
       var nameData = {
            title: 'Spotkanie',
            location: 'Odra',
            alldayevent: true,
            startdate: null
        }

        var nsDate1 = currentRecord.getValue({
            fieldId: 'custevent3'
        });

        var nsDate2 = currentRecord.getValue({
            fieldId: 'custevent4'
        });

        var createEvent = currentRecord.getValue({
            fieldId: 'custevent5'
        })

        var date1 = new Date(nsDate1);
        var date2 = new Date(nsDate2);
        var differenceInTime = date2.getTime() - date1.getTime();
        var differenceInDays = differenceInTime / (1000 * 3600 * 24);

        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
        
            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;
        
            return [year, month, day].join('-');
        }

        if(createEvent) {
            var objRecord = record.create({
                type: record.Type.CALENDAR_EVENT,
                isDynamic: true
            });

            for (var i = 0; i < differenceInDays; i++) {
                var newDate = new Date(nsDate1);
                newDate.setTime(date1.getTime() +  i * 24 * 60 * 60 * 1000);
                nameData.startdate = new Date(formatDate(newDate));
            
                objRecord.setValue({
                fieldId: 'subsidiary',
                value: '1'
            });
            for (var key in nameData) {
                if (nameData.hasOwnProperty(key)) {
                    objRecord.setValue({
                        fieldId: key,
                        value: nameData[key]
                    });
                }
            }
    
            var recordId = objRecord.save({
                enableSourcing: false,
                ignoreMandatoryFields: true
            });
         }
        }
     
        if (differenceInDays <= 0) {
            dialog.alert({
                title: 'Calculate days',
                message: 'Difference in days: ' + differenceInDays + '. The system will not create events if calculate dates is less than 0.'
            });
            return true;
        } {
            dialog.alert({
                title: 'Calculate days',
                message: 'Difference in days: ' + createEvent + '. The system will create: ' + differenceInDays +' events.'
            });
            return true
        } 
   }
    
    return {
        pageInit: pageInit,
      	saveRecord: saveRecord
    }
    
});
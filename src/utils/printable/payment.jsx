import { getCurrentDate } from "../helper";

export function handlePrintPayment(
 contart , staff
) {
  const printWindow = window.open("", "", "width=600,height=800");
  printWindow.document.open();
  printWindow.document.write(`
 <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contrat N° </title>
    <style>
        * {
            font-size: 16px;
        }
        .container {
            display: flex;
            height: 300px;
            flex-direction: column;
            background-color: blue;
        }

        .header {
            display: flex;
            flex-direction: row;
            height: 150px;
        }

        .header-left {
            flex: 2
        }

        .header-right {
            flex: 1
        }



        .content {
            flex: 1;
            display: flex;
            flex-direction: row;
        }

        .client-infos {
            flex: 1
        }

        .club-info {
            flex: 1
        }

        .footer {
            height: 100px;
        }

        span {
            font-size: 12px;
            font-weight: bold;
        }

        .containerTitle{
            display: block;
            height: 50px;
            width: 250px !important;
            align-items: center;
            justify-content: center;
            padding: 6px;
            background-color: #e6e7e9;
            border: 1px solid black;
            text-align: center;
        }

        #title {
            
            font-size: 20px;
            font-weight: bold;
            
        }

        .infos tr td {
            text-align: center;
            height: 30px;
            font-size: 13px;
            font-weight: bold;
        }

       
        ul li {
            font-size: 12px;
            font-weight: 700;
            line-height: 16px;
            
        }

        .containerPay {
            position: relative;
        }

        .types {
            list-style-type: none;
            position: absolute;
            top: 50%;
            left: 50%;
            margin: -25px 0 0 -25px;
        }

        #text-reg {
            font-size: 11px;
            font-weight: 700;
            line-height: 15px;
        }

        .conditions p {
            font-size: 10px !important;
            line-height: 8px;
            text-align: justify;
        }

        .titleCondition {
            font-size: 11px;
            font-weight: bold;
        }
        #tititreCondition {
            font-size: 20px;
            font-weight: bold;
            text-align: center;
        }

        

    </style>
</head>

<body>
    <table width="100%" aria-expanded="true" height="100%">
        <tbody>
            <tr height="200px" >
                <td colspan="3">
                    <img src="https://JyssrMmas.pythonanywhere.com/media/assets/logo/logommas.png" width="180px" />
                </td>
                <td colspan="9" style="padding-right: 60px">
                        <span style="font-size: 20px;" style= "font-weight:bold"  text-align:center > &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fiche de paie </span>
                </td>
                <td colspan="3">
                    <img src="https://JyssrMmas.pythonanywhere.com/media/assets/logo/logoAlbissat.jpeg" width="180px" />
                </td>
                
            </tr>
            <tr>
                <td colspan="12" >
                    <br/>
                    <br/>
                    <br/>
                    
                    <span style="font-size: 15px;" >Je soussigné</span>
                    <br/>
                    <span style="color: grey; font-size: 17px; font-weight:bold" >${ staff.nom}  ${ staff.prenom}</span>
                    <br/>
                    <span style="font-size: 15px;">Numéro de carte nationale :</span>
                    <span style="font-size: 17px; color: grey;" style= "font-weight:bold">${ staff.cin}</span>
                    <br/>
                    <span style="font-size: 15px;">validité CIN :</span>
                    <span style="font-size: 17px; color: grey;" style= "font-weight:bold">${ staff.validite_CIN}/${ staff.validite_CIN }/${ staff.validite_CIN }</span>
                    <br/>
                  
                    <span style="font-size: 15px;">Fonction :</span>
                    <span style="font-size: 17px; color: grey;" style= "font-weight:bold">${ staff.fonction}</span>
                    <br/>
                    <br/>
                    <br/>
                    <span style="font-size: 15px;">Atteste avoir recu, en bonne et due forme, le salaire de la période du mois</span>
                    <span style="font-size: 17px; color: grey;" style= "font-weight:bold">${contart.PeriodeSalaire}</span> 
                    <span style="font-size: 15px;"><span style="font-size: 15px;"> de la part de l'association sportive ALBISSAT AL ALHDAR d'un montant total de </span> <span style="font-size: 17px; color: grey;" style= "font-weight:bold"> ${contart.salaire_final} Dhs.</span>
                            <br/>
                    <tr>
                    <td colspan="12" >
                        <br/>
                        <span style="font-size: 14px">Fait à Fes ,le</span><br/>
                        </td>
                    </tr>
                        <tr>
                            <td colspan="12">
                                <br/>
                                <br/>
                                <br/>
                                <span style="font-size: 13px">Signature du salarié</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size: 13px">Signature de l'employeur</span>
                            </td>
                        </tr>
                     
                </td>
            </tr>
        </tbody>
</body>

</html>
  `);

  printWindow.document.close();
  printWindow.print();
}
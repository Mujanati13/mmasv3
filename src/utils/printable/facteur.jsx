import { getCurrentDate } from "../helper";

export function printFacteur(contrat, paymentData) {
    console.log(contrat);
    
  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.open();

  const currentDate = getCurrentDate();
  const [day, month, year] = currentDate.split('/');

  // Format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Calculate financial details
  const montantTTC = paymentData.montant + contrat?.reste;
  const montantHT = montantTTC / 1.2; // Assuming 20% VAT
  const tva = montantTTC - montantHT;

  printWindow.document.write(`
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction </title>
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
            text-decoration: underline dotted;
            color: #22427c;
        
            
        }
        #date {
            
            font-size: 18px;
            color: #22427c;
        
            
        }
        #pied {
            
            font-size: 16px;
            text-align: center;
        
            
        }
        #montantt {
            
            font-size: 14px;
            color: #22427c;
        
            
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
           
            <tr>
                <td colspan="12">&nbsp; </td>
            </tr>
            <tr>
                <td colspan="12">&nbsp; </td>
            </tr>
            <tr>
                <td colspan="12">&nbsp; </td>
            </tr>
            <tr>
                <td colspan="12">&nbsp; </td>
            </tr>
            <tr height="300px" >
                <td colspan="3">
                    <img src="https://JyssrMMAS.pythonanywhere.com/media/assets/logo/logommas.png" width="180px" />
                </td>
                <td colspan="4"></td>
                <td colspan="5" style="padding-right: 60px">
                    <span style="font-size: 18px"></span><br/>
                    <span style="font-size: 18px"></span><br/>
                    <div>
                        <span id="title">Reçu <br></span>
                    </div>
                    <span style="font-size: 18px"></span><br/>
                    <span id="date">Date Le: 22/10/2024 </span><br/>
                    <span id="montantt">Montant en chiffres : 400.0</span><br/>
                </td>
                
            </tr>
            <tr>
                <td colspan="12" style="font-size: 14px">
                    <br/>
                    <span style="font-size: 14px"> </span><br/>
                    <span style="font-size: 14px"> </span>
                </td>
            </tr>
        
            <tr></tr>
            <tr>
                <td colspan="12">
                    <table border="1" class="infos">
                        <tr>
                            <td style="background-color: #C8E1FE;">Nom de l'enfant </td>
                            <td colspan="4">haddad saad</td>
                        </tr>
                        <tr>
                            <td style="background-color: #C8E1FE;">{{paymentData.Système}}</td>
                             <td colspan="4">AMERICAIN</td>
                        </tr>
                        <tr>
                            <td style="background-color: #C8E1FE;">Niveau</td>
                            <td colspan="4">CE1</td>
                        </tr>
                        <tr>
                            <td style="background-color: #C8E1FE;"> Montant en lettres</td>
                            <td colspan="4">400.0 dirhams</td>

                        </tr>
                        <tr>
                            <td style="background-color: #C8E1FE;">N° Contrat</td>
                            <td colspan="4">188-24-222 </td>

                        </tr>
                    </table>
                </td>
            </tr>
        
            <tr>
                <td colspan="12" style="font-size: 14px">
                    <br/>
                    <span style="font-size: 14px">Reçu inscription au centre Meet Me After SChool en cours de : </span><br/>
                    <span style="font-size: 14px"> </span>
                </td>
            </tr>
            <tr>
                <td colspan="12" style="font-size: 14px">
                    <br/>
                    <span style="font-size: 14px"> </span><br/>
                    <span style="font-size: 14px"> </span>
                </td>
            </tr>
            <tr>
                <td colspan="12">
                    <table border="1" class="infos">
                        <tr>
                            
                            <td> &nbsp;AIDE AUX DEVOIRES</td>
                            <td> &nbsp; COURS DE SOUTIEN</td>
                            <td colspan="2">
                                &nbsp;  ACTIVITES</td>
                        </tr>
                       
                        
                    </table>
                </td>
                <tr>
                    <td colspan="12">
                        <table border="1" class="infos">
                            <tr>
                                
                                <td>
                                   
                                      &nbsp;AUTRES PRESTATION</td>
                                <td>
                                    
                                     &nbsp; FRAIS D'INSCRIPTION (200DHS)</td>
                                <td colspan="2">
                                    
                                     &nbsp; *VACANCES</td>
                            </tr>
                           
                            
                        </table>
                    </td>
                </tr>
                
                <tr>
                    <td colspan="12" style="font-size: 14px">
                        <br/>
                        <span style="font-size: 14px"> </span><br/>
                        <span style="font-size: 14px"> </span>
                    </td>
                </tr>
            </tr>
            <tr>
                <td colspan="12">
                    <table border="1" class="infos">
                        <tr>
                            
                            <td> &nbsp;Chéques</td>
                            <td> &nbsp; TPE</td>
                            <td colspan="2"> &nbsp;  Espéces</td>
                        </tr>
                       
                        
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan="12" style="font-size: 14px">
                    <br/>
                    <span  style="font-size: 14px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Copie Administration</span><br/>
                    <span style="font-size: 14px"> </span>
                </td>
            </tr>
            
            <tr>
                <td colspan="12">&nbsp; </td>
            </tr>
            <tr>
                <td colspan="12">&nbsp; </td>
            </tr>
            <tr>
                <td colspan="12">&nbsp; </td>
            </tr>
            <tr>
                <td colspan="12">&nbsp; </td>
            </tr>
            <tr>
                <td colspan="12">&nbsp; </td>
            </tr>
          
        </tbody>
</body>

</html>
  `);

  printWindow.document.close();
  printWindow.print();
}
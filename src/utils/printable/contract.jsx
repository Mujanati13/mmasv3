import { getCurrentDate } from "../helper";
import download from "downloadjs";

export function handlePrintContract(cleintobj, contartobj) {
  if (true) {
    const printWindow = window.open("", "", "width=600,height=800");
    printWindow.document.open();
    printWindow.document.write(`
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contrat N° ${contartobj.id_contrat} - ${contartobj.numcontrat}</title>
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
            width: 400px !important;
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
            width:50%;
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
                <td colspan="9" style="padding-right: 60px;width:300px">
                    <div class="containerTitle">
                        <span id="title">CONTRAT D'ABONNEMENT MMAS <br> Meet Me After School <br> </span>
                    </div>
                    N°${contartobj.numcontrat}
                    <h5>année scolaire : 2024/2025</h5>
                </td>
            </tr>
            <tr>
                <td colspan="12">
                    <table border="2" class="infos">
                        <tr>
                            <td style="background-color: #e6e7e9;">Civilité</td>
                            <td>${cleintobj.civilite === "Madmoiselle" ?
                                '<img width="16px" height="16px" src="https://JyssrMmas.pythonanywhere.com/media/assets/objects/radio.png" />' :
                                '<img width="16px" height="16px" src="https://JyssrMmas.pythonanywhere.com/media/assets/objects/empty.png" />'
                            }  &nbsp;Madmoiselle</td>
                            <td>${cleintobj.civilite === "Madame" ?
                                '<img width="16px" height="16px" src="https://JyssrMmas.pythonanywhere.com/media/assets/objects/radio.png" />' :
                                '<img width="16px" height="16px" src="https://JyssrMmas.pythonanywhere.com/media/assets/objects/empty.png" />'
                            } &nbsp; Madame</td>
                            <td colspan="2">${cleintobj.civilite === "Monsieur" ?
                                '<img width="16px" height="16px" src="https://JyssrMmas.pythonanywhere.com/media/assets/objects/radio.png" />' :
                                '<img width="16px" height="16px" src="https://JyssrMmas.pythonanywhere.com/media/assets/objects/empty.png" />'
                            } &nbsp;  Monsieur</td>
                        </tr>
                        <tr>
                            <td style="background-color: #e6e7e9;">Prénom</td>
                            <td>${cleintobj.prenom}</td>
                            <td style="background-color: #e6e7e9;">Nom</td>
                            <td colspan="2">${cleintobj.nom}</td>
                        </tr>
                        <tr>
                            <td style="background-color: #e6e7e9;">Adresse</td>
                             <td colspan="4">${cleintobj.adresse}</td>
                        </tr>
                        <tr>
                            <td style="background-color: #e6e7e9;">Code Postal</td>
                            <td>${cleintobj.code_postal || ''}</td>
                            <td style="background-color: #e6e7e9;">Ville</td>
                            <td colspan="2">${cleintobj.nom_ville}</td>
                        </tr>
                        <tr>
                            <td style="background-color: #e6e7e9;">Téléphone portable</td>
                            <td>${cleintobj.tel}</td>
                            <td style="background-color: #e6e7e9;">Téléphone fixe</td>
                            <td colspan="2">${cleintobj.tel_fixe || ''}</td>
                        </tr>
                        <tr>
                            <td style="background-color: #e6e7e9;">Date de naissance</td>
                             <td colspan="4">${cleintobj.date_naissance}</td>
                        </tr>
                        <tr>
                            <td style="background-color: #e6e7e9;">Email</td>
                             <td colspan="4">${cleintobj.mail}</td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr>
                <td colspan="12">
                    <br/>
                    <table border="1" class="infos" style="margin-right: 20px !important;">
                        <tr>
                            <td style="background-color: #e6e7e9;">date d'inscription</td>
                             <td colspan="3"> Le ${new Date(contartobj.date_debut).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td style="background-color: #e6e7e9;"> Type D'abonnement</td>
                             <td colspan="3">${contartobj.type_abonnement}</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan="12">
                    <br/>
                    <span>Mode De Réglement :</span>
                    <div class="containerPay">
                        <ul class="types">
                            <li>
                                ${contartobj.mode_reglement === "Chéques" ?
                                '<img width="16px" height="16px" src="https://JyssrMmas.pythonanywhere.com/media/assets/objects/radio.png" />' :
                                '<img width="16px" height="16px" src="https://JyssrMmas.pythonanywhere.com/media/assets/objects/empty.png" />'
                                }
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Chéques <li>
                            <li>
                                ${contartobj.mode_reglement === "Espéces" ?
                                '<img width="16px" height="16px" src="https://JyssrMmas.pythonanywhere.com/media/assets/objects/radio.png" />' :
                                '<img width="16px" height="16px" src="https://JyssrMmas.pythonanywhere.com/media/assets/objects/empty.png" />'
                                }
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Espéces <li>
                            <li>
                                ${contartobj.mode_reglement === "Prélèvements" ?
                                '<img width="16px" height="16px" src="https://JyssrMmas.pythonanywhere.com/media/assets/objects/radio.png" />' :
                                '<img width="16px" height="16px" src="https://JyssrMmas.pythonanywhere.com/media/assets/objects/empty.png" />'
                                }
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Prélèvements <li>
                            <li>
                                ${contartobj.mode_reglement === "Autres" ?
                                '<img width="16px" height="16px" src="https://JyssrMmas.pythonanywhere.com/media/assets/objects/radio.png" />' :
                                '<img width="16px" height="16px" src="https://JyssrMmas.pythonanywhere.com/media/assets/objects/empty.png" />'
                                }
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Autres ......................</li>
                        </ul>
                    </div>
                    <div>
                        <p id="text-reg">Je soussigné(e) : <i><strong>${cleintobj.nom} ${cleintobj.prenom}</strong></i> déclare souscrire un abonnement nominatif pour la durée de validité ci-dessus. Cet abonnement m'autorise à utiliser les installations aux
horaires fixés par la Direction et à participer à l'ensemble des activités proposées par MMAS
                        </p>
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="12" style="font-size: 14px">
                    <br/>
                    <span style="font-size: 14px">Fait à Tanger</span><br/>
                    <span style="font-size: 14px">Le ${new Date().toLocaleDateString()} </span>
                </td>
            </tr>
            <tr>
                <td colspan="12">
                    <br/>
                    <table border="1" class="infos" style="height: 80px;">
                        <thead>
                            <tr>
                                <td style="background-color: #e6e7e9;">Signature du client (représentant légale)</td>
                                <td style="background-color: #e6e7e9;">Signature du Conseiller</td>
                            </tr>
                        </thead>
                        <tr>
                            <td ></td>
                            <td >&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr>
                <td colspan="12">&nbsp; </td>
            </tr>
            <!-- ... (repeated empty rows) ... -->

            <tr >
                <td colspan="12" >
                    <div style="text-align: center; border-top: 1px solid black; padding-top: 10px;">
                        <span style="font-size: 13px;">Meet Me After School, 25 Av Youssef Ibn Tachfine, Immeuble Batouta, Tanger, Maroc.</span>
                        <br/>
                        <span style="font-size: 13px;">Email : contact@mmas.com</span>
                    </div>
                </td>
            </tr>
        </tbody>
        </td>
     </tr>
</body>

</html>`
    );

    printWindow.document.close();
    printWindow.print();
  }
}
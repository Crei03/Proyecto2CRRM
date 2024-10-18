class NumeroATexto {
    static UNIDADES = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
    static DECENAS = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
    static CENTENAS = ["", "CIENTO ", "DOSCIENTOS ", "TRESCIENTOS ", "CUATROCIENTOS ", "QUINIENTOS ", "SEISCIENTOS ", "SETECIENTOS ", "OCHOCIENTOS ", "NOVECIENTOS "];

    constructor() {}

    convertir(numero) {
        let literal = "";
        let parte_decimal;
        numero = numero.replace(".", ",");
        if (numero.indexOf(",") === -1) {
            numero = numero + ",00";
        }

        if (/^\d{1,9},\d{1,2}$/.test(numero)) {
            const Num = numero.split(",");
            parte_decimal = Num[1] + "/100 Balboas.";
            
            const numEntero = parseInt(Num[0]);
            if (numEntero === 0) {
                literal = "cero ";
            } else if (numEntero > 999999) {
                literal = this.getMillones(Num[0]);
            } else if (numEntero > 999) {
                literal = this.getMiles(Num[0]);
            } else if (numEntero > 99) {
                literal = this.getCentenas(Num[0]);
            } else if (numEntero > 9) {
                literal = this.getDecenas(Num[0]);
            } else {
                literal = this.getUnidades(Num[0]);
            }
            return literal + " " + parte_decimal;
        } else {
            return "Número no válido.";
        }
    }

    getUnidades(numero) {
        const num = parseInt(numero.substring(numero.length - 1));
        return NumeroATexto.UNIDADES[num];
    }

    getDecenas(num) {
        const n = parseInt(num);
        if (n < 10) {
            return this.getUnidades(num);
        } else if (n >= 10 && n < 20) {
            return NumeroATexto.DECENAS[n - 10];
        } else if (n >= 20) {
            const decena = Math.floor(n / 10);
            const unidad = n % 10;
            if (unidad === 0) {
                return NumeroATexto.DECENAS[decena + 8];
            } else {
                return NumeroATexto.DECENAS[decena + 8] + " Y " + NumeroATexto.UNIDADES[unidad];
            }
        }
        return "";
    }

    getCentenas(num) {
        const n = parseInt(num);
        if (n === 100) {
            return "CIEN";
        } else if (n > 100) {
            const centenas = Math.floor(n / 100);
            const resto = n % 100;
            return NumeroATexto.CENTENAS[centenas] + this.getDecenas(String(resto)).trim();
        } else {
            return this.getDecenas(num);
        }
    }

    getMiles(numero) {
        const c = numero.substring(numero.length - 3);
        const m = numero.substring(0, numero.length - 3);
        const miles = parseInt(m);
        if (miles === 1) {
            return "MIL " + this.getCentenas(c);
        } else if (miles > 1) {
            let n = this.getCentenas(m);
            if (n.trim().endsWith("UNO")) {
                n = n.substring(0, n.length - 4) + "";
            }
            return n + " MIL " + this.getCentenas(c);
        } else {
            return this.getCentenas(c);
        }
    }

    getMillones(numero) {
        const miles = numero.substring(numero.length - 6);
        const millon = numero.substring(0, numero.length - 6);
        const millones = parseInt(millon);
        let n = " ";
        if (millones === 1) {
            n = "UN MILLON ";
        } else if (millones > 1) {
            n = this.getCentenas(millon) + " MILLONES ";
            if (n.trim().endsWith("UNO MILLONES")) {
                n = n.substring(0, n.length - 12) + " ";
            }
        }
        return n + this.getMiles(miles);
    }
}
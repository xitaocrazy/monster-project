function monsterViewModel () {
    self = this;
    
    var regioes =        ['continente', 'norte', 'centro', 'leste', 'sul'];
    var casinhaValores = [200000, 160000, 220000, 320000, 280000];
    var casaValores =    [350000, 200000, 450000, 400000, 350000];
    var casaoValores =   [900000, 550000, 1100000, 1500000, 1000000];        

    self.deveCarregarMapa = ko.observable(true);
    self.passo = ko.observable(1);
    self.id = ko.observable(0);
    self.valorParcela = ko.observable('');
    self.valorImovel = ko.observable('');  
    self.nome = ko.observable(''); 
    self.email = ko.observable(''); 
    self.tipoDeFamilia = ko.observable(1);
    self.renda = ko.observable(0);
    self.regiao = ko.observable(0);
    self.temErroNoNome = ko.observable(false); 
    self.temErroNoEmail = ko.observable(false);
    self.simulacoes = ko.observableArray([]);
    self.resultadoDetalhes = ko.observableArray([]);
    self.opcoesSelecionadas = ko.observableArray([]);
    self.dummyObservable = ko.observable();
    self.valorEntrada = ko.observable(0);
    
    self.deveIniciarORegistro = ko.computed(function(){
        return (self.valorParcela() !== '' || self.valorImovel() !== '') &&
                self.nome() !== '' &&
                self.email() !== '';
    }, this);
    self.valorR$Parcela = ko.computed(function(){
        var valor = 0;
        switch (self.valorParcela()){
            case '1':
                valor = 1500;
                break;
            case '2':
                valor = 2000;
                break;
            case '3':
                valor = 2500;
                break;
            case '4':
                valor = 3000;
                break;
            default:
                valor = 0;
                break;
        }
        return valor;
    }, this);
    self.valorR$Imovel = ko.computed(function(){
        var valor = 0;
        switch (self.valorImovel()){
            case '1':
                valor = 200000;
                break;
            case '2':
                valor = 400000;
                break;
            case '3':
                valor = 500000;
                break;
            case '4':
                valor = 1000000;
                break;
            default:
                valor = 0;
                break;
        }

        var vintePorCento = valor * 0.20;
        self.valorEntrada(vintePorCento);

        return valor;
    }, this); 
    self.valorImovel5Anos = ko.computed(function(){
        var parcela = self.valorR$Parcela();                                   
        var jurosParcela = parcela * 0.020;
        parcela = parcela - jurosParcela;
        var valorImovel5Anos = parcela * 60;
        return valorImovel5Anos;
    }, this);
    self.valorImovel10Anos = ko.computed(function(){
        var parcela = self.valorR$Parcela();                                   
        var jurosParcela = parcela * 0.040;
        parcela = parcela - jurosParcela;
        var valorImovel10Anos = parcela * 120;
        return valorImovel10Anos;
    }, this);
    self.valorImovel20Anos = ko.computed(function(){
        var parcela = self.valorR$Parcela();                                   
        var jurosParcela = parcela * 0.060
        parcela = parcela - jurosParcela;
        var valorImovel20Anos = parcela * 240;
        return valorImovel20Anos;
    }, this);
    self.valorParcela5Anos = ko.computed(function(){
        var imovel = self.valorR$Imovel() - self.valorEntrada();
        var parcela =  imovel / 60;                                
        var jurosParcela = parcela * 0.020;
        parcela = parcela + jurosParcela;
        return parcela;
    }, this);
    self.valorParcela10Anos = ko.computed(function(){
        var imovel = self.valorR$Imovel() - self.valorEntrada();
        var parcela =  imovel / 120;                                 
        var jurosParcela = parcela * 0.040;
        parcela = parcela + jurosParcela;
        return parcela;
    }, this);
    self.valorParcela20Anos = ko.computed(function(){
        var imovel = self.valorR$Imovel() - self.valorEntrada(); 
        var parcela =  imovel / 240;                                  
        var jurosParcela = parcela * 0.060
        parcela = parcela + jurosParcela;
        return parcela;
    }, this);
    self.casinha5AnosAtivo = ko.computed(function(){
        self.dummyObservable();
        if (self.tipoDeFamilia() > 2){
            return false;
        }
        if (!compararRenda(self.valorR$Parcela(), self.valorParcela5Anos(), self.valorR$Imovel())){
            self.resultadoDetalhes.push('O valor das parcelas em 5 anos, para casas pequenas, é maior do que 35% da renda informada.')
            return false;
        }
        var valor = casinhaValores[self.regiao()];
        if (!compararValores(valor, self.valorR$Parcela(), self.valorImovel5Anos(), self.valorR$Imovel())){
            self.resultadoDetalhes.push('O valor do imóvel em 5 anos, para casas pequenas, é menor do que a média da região.')
            return false;
        }
        return true;
    }, this);
    self.casa5AnosAtivo = ko.computed(function(){
        self.dummyObservable();
        if (self.tipoDeFamilia() > 3){
            return false;
        }
        if (!compararRenda(self.valorR$Parcela(), self.valorParcela5Anos(), self.valorR$Imovel())){
            self.resultadoDetalhes.push('O valor das parcelas em 5 anos, para casas médias ou grandes, é maior do que 35% da renda informada.')
            return false;
        }
        var valor = casaValores[self.regiao()];
        if (!compararValores(valor, self.valorR$Parcela(), self.valorImovel5Anos(), self.valorR$Imovel())){
            self.resultadoDetalhes.push('O valor do imóvel em 5 anos, para casas médias ou grandes, é menor do que a média da região.')
            return false;
        }
        return true;
    }, this);
    self.casao5AnosAtivo = ko.computed(function(){
        self.dummyObservable();
        if (self.tipoDeFamilia() < 3){
            return false;
        }
        if (!compararRenda(self.valorR$Parcela(), self.valorParcela10Anos(), self.valorR$Imovel())){
            self.resultadoDetalhes.push('O valor das parcelas em 5 anos, para casas muito grandes, é maior do que 35% da renda informada.')
            return false;
        }
        var valor = casaoValores[self.regiao()];
        if (!compararValores(valor, self.valorR$Parcela(), self.valorImovel5Anos(), self.valorR$Imovel())){
            self.resultadoDetalhes.push('O valor do imóvel em 5 anos, para casas muito grandes, é menor do que a média da região.')
            return false;
        }
        return true;
    }, this);
    self.casinha10AnosAtivo = ko.computed(function(){
        self.dummyObservable();
        if (self.tipoDeFamilia() > 2){
            return false;
        }
        if (!compararRenda(self.valorR$Parcela(), self.valorParcela10Anos(), self.valorR$Imovel())){
            self.resultadoDetalhes.push('O valor das parcelas em 10 anos, para casas pequenas, é maior do que 35% da renda informada.')
            return false;
        }
        var valor = casinhaValores[self.regiao()];
        if (!compararValores(valor, self.valorR$Parcela(), self.valorImovel10Anos(), self.valorR$Imovel())){
            self.resultadoDetalhes.push('O valor do imóvel em 5 anos, para casas pequenas, é menor do que a média da região.')
            return false;
        }
        return true;
    }, this);
    self.casa10AnosAtivo = ko.computed(function(){
        self.dummyObservable();
        if (self.tipoDeFamilia() > 3){
            return false;
        }
        if (!compararRenda(self.valorR$Parcela(), self.valorParcela10Anos(), self.valorR$Imovel())){
            self.resultadoDetalhes.push('O valor das parcelas em 10 anos, para casas médias ou grandes, é maior do que 35% da renda informada.')
            return false;
        }
        var valor = casaValores[self.regiao()];
        if (!compararValores(valor, self.valorR$Parcela(), self.valorImovel10Anos(), self.valorR$Imovel())){
            self.resultadoDetalhes.push('O valor do imóvel em 5 anos, para casas médias ou grandes, é menor do que a média da região.')
            return false;
        }
        return true;
    }, this);
    self.casao10AnosAtivo = ko.computed(function(){
        self.dummyObservable();
        if (self.tipoDeFamilia() < 3){                
            return false;
        }
        if (!compararRenda(self.valorR$Parcela(), self.valorParcela10Anos(), self.valorR$Imovel())){
            self.resultadoDetalhes.push('O valor das parcelas em 10 anos, para casas muito grandes, é maior do que 35% da renda informada.')
            return false;
        }
        var valor = casaoValores[self.regiao()];
        if (!compararValores(valor, self.valorR$Parcela(), self.valorImovel10Anos(), self.valorR$Imovel())){
            self.resultadoDetalhes.push('O valor do imóvel em 5 anos, para casas muito grandes, é menor do que a média da região.')
            return false;
        }
        return true;
    }, this);
    self.casinha20AnosAtivo = ko.computed(function(){
        self.dummyObservable();
        if (self.tipoDeFamilia() > 2){
            return false;
        }
        if (!compararRenda(self.valorR$Parcela(), self.valorParcela20Anos(), self.valorR$Imovel())){
            self.resultadoDetalhes.push('O valor das parcelas em 20 anos, para casas pequenas, é maior do que 35% da renda informada.')
            return false;
        }
        var valor = casinhaValores[self.regiao()];
        if (!compararValores(valor, self.valorR$Parcela(), self.valorImovel20Anos(), self.valorR$Imovel())){
            self.resultadoDetalhes.push('O valor do imóvel em 20 anos, para casas pequenas, é menor do que a média da região.')
            return false;
        }
        return true;
    }, this);
    self.casa20AnosAtivo = ko.computed(function(){
        self.dummyObservable();
        if (self.tipoDeFamilia() > 3){
            return false;
        }
        if (!compararRenda(self.valorR$Parcela(), self.valorParcela20Anos(), self.valorR$Imovel())){
            self.resultadoDetalhes.push('O valor das parcelas em 20 anos, para casas médias ou grandes, é maior do que 35% da renda informada.')
            return false;
        }
        var valor = casaValores[self.regiao()];
        if (!compararValores(valor, self.valorR$Parcela(), self.valorImovel20Anos(), self.valorR$Imovel())){
            self.resultadoDetalhes.push('O valor do imóvel em 5 anos, para casas médias ou grandes, é menor do que a média da região.')
            return false;
        }
        return true;
    }, this);
    self.casao20AnosAtivo = ko.computed(function(){
        self.dummyObservable();
        if (self.tipoDeFamilia() < 3){
            return false;
        }
        if (!compararRenda(self.valorR$Parcela(), self.valorParcela20Anos(), self.valorR$Imovel())){
            self.resultadoDetalhes.push('O valor das parcelas em 20 anos, para casas muito grandes, é maior do que 35% da renda informada.')
            return false;
        }
        var valor = casaoValores[self.regiao()];
        if (!compararValores(valor, self.valorR$Parcela(), self.valorImovel20Anos(), self.valorR$Imovel())){
            self.resultadoDetalhes.push('O valor do imóvel em 5 anos, para casas muito grandes, é menor do que a média da região.')
            return false;
        }
        return true;
    }, this);
           
    self.limparValorImovel = function(){
        self.valorImovel('');
        return true;
    };
    self.limparValorParcela = function(){
        self.valorParcela('');
        return true;
    };
    self.iniciarCadastro = function(valor){
        ehNomeValido();
        ehEmailValido();
        if(!self.temErroNoNome() && !self.temErroNoEmail()) {            
            cadastrar();                        
            //proximoPasso();
        }
    };
    self.setarTipoDeFamilia = function(tipo){
        var tipoDeFamilia = parseInt(tipo);
        self.tipoDeFamilia(tipoDeFamilia);
        salvarTipoDeFamilia();
        //proximoPasso();
    };
    self.setarRegiao = function(regiao){
        var regiaoDesejada = parseInt(regiao);
        self.regiao(regiao);
        salvarRegiao();
        //proximoPasso();
    };
    self.setarRenda = function(valor){
        var rendaInformada = parseFloat(valor);
        self.renda(rendaInformada);
        setarOpcoesSelecionadas();
        setarSimulacoes();
        setarDetalhes();
        salvarRenda();
        //proximoPasso();
        
    };   
    self.reload = function(){
        location.reload(true);
    };
    
    function proximoPasso(){
        var passo = self.passo() + 1;
        self.passo(passo);
    };
    function passoAnterior(){
        var passo = self.passo() - 1;
        self.passo(passo);
    };
    function ehNomeValido(){
        self.temErroNoNome(false);
        er = /^([a-zA-ZáéíóúàâêôãõüçÁÉÍÓÚÀÂÊÔÃÕÜÇ ]|\n){2,50} ([a-zA-ZáéíóúàâêôãõüçÁÉÍÓÚÀÂÊÔÃÕÜÇ ]|\n){2,50}$/; 
        if(!er.exec(self.nome())){
            self.temErroNoNome(true);
        }
    }  
    function ehEmailValido(){
        self.temErroNoEmail(false);
        er = /^[A-Za-z0-9](([_.-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([.-]?[a-zA-Z0-9]+)*)([.][A-Za-z]{2,4})$/; 
        if(!er.exec(self.email())){
            self.temErroNoEmail(true);
        }
    }    
    function cadastrar(){
        $.getJSON("/storeLead", {valorParcela: self.valorR$Parcela(), valorImovel: self.valorR$Imovel(), nome: self.nome(), email: self.email() })
            .done(function(result) {
                self.id(result.id);
                setAnalitycsPage('/pagina-familia');
                proximoPasso();
            })
            .fail(function() {
                alert('Ops. Algo errado não está certo. Tente novamente');
            });
    }  
    function salvarTipoDeFamilia(){
        var tipo = '';
        switch (self.tipoDeFamilia()){
            case 1:
                tipo = 'Uma pessoa';
                break;
            case 2:
                tipo = 'Casal sem filhos';
                break;
            case 3:
                tipo = 'Casal com um filho';
                break;
            case 4:
                tipo = 'Casal com mais de um filho';
                break;
        }
        $.getJSON("/updateLeadFamilia", {id: self.id(), tipoFamilia: tipo})
            .done(function(result) {
                if (result.updated){
                    setAnalitycsPage('/pagina-regiao');
                    proximoPasso();
                }else{
                    alert('Ops. Algo errado não está certo. Tente novamente');
                }
            })
            .fail(function() {
                alert('Ops. Algo errado não está certo. Tente novamente');
            });
    }  
    function salvarRegiao(){
        var regiaoSelecionada = regioes[self.regiao()];
        $.getJSON("/updateLeadRegiao", {id: self.id(), regiao: regiaoSelecionada})
            .done(function(result) {
                if (result.updated){
                    setAnalitycsPage('/pagina-renda');
                    proximoPasso();
                }else{
                    alert('Ops. Algo errado não está certo. Tente novamente');
                }
            })
            .fail(function() {
                alert('Ops. Algo errado não está certo. Tente novamente');
            });
    }  
    function salvarRenda(){
        $.getJSON("/updateLeadRenda", {id: self.id(), renda: self.renda()})
            .done(function(result) {
                if (result.updated){
                    setAnalitycsPage('/pagina-resultado');
                    proximoPasso();
                }else{
                    alert('Ops. Algo errado não está certo. Tente novamente');
                }
            })
            .fail(function() {
                alert('Ops. Algo errado não está certo. Tente novamente');
            });
    } 
    function compararValores(valorMedio, valorParcela, valorPeriodo, valorImovel){
        if (valorParcela !== 0){
            if (valorPeriodo < valorMedio){
                return false;
            }
        }
        if (valorImovel !== 0){
            if (valorImovel < valorMedio){
                return false;
            }
        }
        return true;
    }
    function compararRenda(valorParcela, valorParcelaPeriodo, valorImovel){
        var vintPorCento = self.renda() * 0.35;
        if (valorParcela !== 0){
            if (valorParcela > vintPorCento){
                return false;
            }
        }
        if (valorImovel !== 0){
            if (valorParcelaPeriodo > vintPorCento){
                return false;
            }
        }            
        return true;
    }
    function setarOpcoesSelecionadas(){
        self.opcoesSelecionadas([]);
        if (self.valorR$Imovel() !== 0){
            self.opcoesSelecionadas.push('Valor do imóvel:  R$' + self.valorR$Imovel() + ',00');
        }else{
            self.opcoesSelecionadas.push('Valor da parcela: R$' + self.valorR$Parcela() + ',00')
        }

        switch (self.tipoDeFamilia()){
            case 1:
                self.opcoesSelecionadas.push('Família: Somente uma pessoa.')
                break;
            case 2:
                self.opcoesSelecionadas.push('Família: Casal sem filhos.')
                break;
            case 3:
                self.opcoesSelecionadas.push('Família: Casal com 1 filho.')
            break;
                case 4:
                self.opcoesSelecionadas.push('Família: Casal com mais de um filho.')
                break;
        }

        self.opcoesSelecionadas.push('Buscando imóveis na região: ' + regioes[self.regiao()]);
        self.opcoesSelecionadas.push('Possui uma renda de R$: ' + self.renda() + ',00');

        if (self.tipoDeFamilia() === 1){
            self.opcoesSelecionadas.push("Você é solteiro, recomendamos uma casa pequena ou média (no máximo 2 quartos).")
        }
        if (self.tipoDeFamilia() === 2){
            self.opcoesSelecionadas.push("Você tem uma família pequena, recomendamos uma casa pequena ou média (de 1 até 3 quartos).")
        }
        if (self.tipoDeFamilia() === 3){
            self.opcoesSelecionadas.push("Você tem uma família média, recomendamos uma casa média (com 3 ou mais quartos).")
        }
        if (self.tipoDeFamilia() === 4){
            self.opcoesSelecionadas.push("Você tem uma família grande, recomendamos uma casa grande (com 4 ou mais quartos).")
        }
    }
    function setarSimulacoes(){
        self.simulacoes([]);
        if (self.valorR$Imovel() !== 0){
            self.simulacoes.push('Valor da entrada (20% do valor de imóvel): R$' + self.valorEntrada() + ',00');
            self.simulacoes.push('Valor da parcela para compra em 5 anos: R$' + self.valorParcela5Anos() + ',00');
            self.simulacoes.push('Valor da parcela para compra em 10 anos: R$' + self.valorParcela10Anos() + ',00');
            self.simulacoes.push('Valor da parcela para compra em 20 anos: R$' + self.valorParcela20Anos() + ',00');
        }else{
            self.simulacoes.push('Valor financiado em 5 anos: R$' + self.valorImovel5Anos() + ',00');
            var entrada = self.valorImovel5Anos() * 0.2;
            self.simulacoes.push('Valor da entrada para compra em 5 anos (20% do valor de imóvel): R$' + entrada + ',00');
            self.simulacoes.push('Valor financiado em 10 anos: R$' + self.valorImovel10Anos() + ',00');
            entrada = self.valorImovel10Anos() * 0.2;
            self.simulacoes.push('Valor da entrada para compra em 10 anos (20% do valor de imóvel): R$' + entrada + ',00');
            self.simulacoes.push('Valor financiado em 20 anos: R$' + self.valorImovel20Anos() + ',00');
            entrada = self.valorImovel20Anos() * 0.2;
            self.simulacoes.push('Valor da entrada para compra em 20 anos (20% do valor de imóvel): R$' + entrada + ',00');
        }
    }
    function setarDetalhes(){
        self.resultadoDetalhes([]);
        self.dummyObservable.notifySubscribers();  
        
        switch (self.tipoDeFamilia()){
            case 1:
            case 2:
                self.resultadoDetalhes.push('Não foram considerados imóveis com mais de 3 quartos.')
                break;
            case 3:
                self.resultadoDetalhes.push('Não foram considerados imóveis com menos de 2 quartos.')
                break;
            case 4:
                self.resultadoDetalhes.push('Não foram considerados imóveis com menos de 3 quartos.')
                break;
        }

        var detalhes = self.resultadoDetalhes();
        detalhes = detalhes.filter(function(item, pos) {
            return detalhes.indexOf(item) == pos;
        })
        self.resultadoDetalhes(detalhes);
    };
    function setAnalitycsPage(page){
        gtag('event', 'page_view', { 'send_to': page });
    }
    
    $(function() {
        $('.map').maphilight();
        $('#squidheadlink').mouseover(function(e) {
            $('#squidhead').mouseover();
        }).mouseout(function(e) {
            $('#squidhead').mouseout();
        }).click(function(e) { e.preventDefault(); });
    });

    $( document ).ready(function() {
        setAnalitycsPage('/pagina-inicial');
        self.deveCarregarMapa(false);
    });
}
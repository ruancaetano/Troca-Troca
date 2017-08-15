app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('login');
  
  $stateProvider
  
  .state('menu', {
    url: '/menu',
    templateUrl: 'templates/Menu/menu.html',
    controller : 'menuController',
    abastract: true

  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/Login/login.html',
    controller: 'loginController'
  })

  .state('cadastro', {
    url: '/cadastro',
    templateUrl: 'templates/Cadastro/cadastro.html',
    controller: 'cadastroController'
  })


  .state('menu.perfil', {
    url: '/perfil',
    views: {
      'menuContent': {
        templateUrl: 'templates/Perfil/perfil.html',
        controller: 'perfilController'
      }
    }
  })

  .state('menu.novaVenda', {
    url: '/novaVenda',
    views: {
      'menuContent': {
        templateUrl: 'templates/NovaVenda/novaVenda.html',
        controller: 'novaVendaController'
      }
    }
  })

  .state('menu.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/Home/home.html',
        controller: 'homeController'
      }
    }
  })

  .state('menu.vendas', {
    url: '/vendas:idUsuario?/:idVendaToScroll?',
    views: {
      'menuContent': {
        templateUrl: 'templates/Vendas/vendas.html',
        controller: 'vendasController'
      }
    }
  })

  .state('menu.minhasDivulgacoes', {
    url: '/minhasDivulgacoes:idVendaToScroll?',
    views: {
      'menuContent': {
        templateUrl: 'templates/MinhasDivulgacoes/minhasDivulgacoes.html',
        controller: 'minhasDivulgacoesController'
      }
    }
  })

  .state('menu.editarVenda', {
    url: '/editarVenda',
    views: {
      'menuContent': {
        templateUrl: 'templates/EditarVenda/editarVenda.html',
        controller: 'editarVendaController'
      }
    }
  })

  .state('menu.miniPagina', {
    url: '/miniPagina/:idUsuario',
    views: {
      'menuContent': {
        templateUrl: 'templates/MiniPagina/miniPagina.html',
        controller: 'miniPaginaController'
      }
    }
  })

  .state('menu.chat', {
    url: '/chat/:idUsuario',
    views: {
      'menuContent': {
        templateUrl: 'templates/Chat/chat.html',
        controller: 'chatController'
      }
    }
  })

  .state('menu.conversas', {
    url: '/conversas',
    views: {
      'menuContent': {
        templateUrl: 'templates/Conversas/conversas.html',
        controller: 'conversasController'
      }
    }
  })
  .state('menu.notificacoes', {
    url: '/notificacoes',
    views: {
      'menuContent': {
        templateUrl: 'templates/Notificacoes/notificacoes.html',
        controller: 'notificacoesController'
      }
    }
  })

  .state('menu.buscarUsuarios', {
    url: '/buscarUsuarios',
    views: {
      'menuContent': {
        templateUrl: 'templates/BuscarUsuarios/buscarUsuarios.html',
        controller: 'buscarUsuariosController'
      }
    }
  })
});



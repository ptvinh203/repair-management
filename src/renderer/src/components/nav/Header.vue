<template>
  <nav class="navbar shadow-sm">
    <div class="container-fluid">
      <div class="navbar-brand">
        <h1 class="h4 mb-0 text-white">{{ $t('app.title') }}</h1>
      </div>
      <ul class="navbar-nav ms-auto gap-2 flex-row">
        <li class="nav-item">
          <router-link
            to="/search"
            class="nav-link text-white"
            :class="{ active: $route.path === '/search' }"
          >
            {{ $t('navigation.search') }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/customer/create"
            class="nav-link text-white"
            :class="{ active: $route.path === '/customer/create' }"
          >
            {{ $t('navigation.addCustomer') }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/repair/create"
            class="nav-link text-white"
            :class="{ active: $route.path === '/repair/create' }"
          >
            {{ $t('navigation.addRepair') }}
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.navbar {
  background: linear-gradient(135deg, #2c3e50, #3498db);

  .nav-item {
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s ease;
    font-size: 0.9rem;

    .active {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 0.2rem;
      font-weight: bold;
    }

    :hover {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 0.2rem;
      opacity: 0.8;
    }

    .nav-link {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
  }
}
</style>

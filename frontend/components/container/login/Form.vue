<template>
  <div class="form-container">
    <AtomsCard variant="default" size="large">
      <template #title>
        <h2>ユーザー登録</h2>
      </template>
      <template #description>
        <form @submit.prevent="registerUser" class="register-form">
          <AtomsTextInput
            v-model="username"
            id="username"
            name="username"
            label="ユーザー名："
            :size="'large'"
            :errorMessage="usernameError"
            @focus="usernameError = ''"
          />
          <AtomsTextInput
            v-model="password"
            id="password"
            name="password"
            label="パスワード："
            :size="'large'"
            :errorMessage="passwordError"
            @focus="passwordError = ''"
            type="password"
          />
          <MoleculesDropdownMenu
            label="好きな海の生き物"
            :items="[
              'タイ',
              'イカ',
              'クラゲ',
              'マグロ',
              'クジラ',
              'マンボウ',
              'ウミガメ',
              '伊勢海老',
            ]"
            @select="handleSelect"
            :errorMessage="favoriteFishError"
          />
          <br />
          <AtomsButton size="large" type="submit">ログイン</AtomsButton>
        </form>
      </template>
    </AtomsCard>
    <AtomsText
      size="large"
      :error="true"
      v-show="errorMessage"
      class="error-message"
    >
      {{ errorMessage }}
    </AtomsText>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";

const username = ref("");
const password = ref("");
const favoriteFish = ref("");
const errorMessage = ref("");
const userStore = useUserStore();
const router = useRouter();

const passwordError = ref("");
const usernameError = ref("");
const favoriteFishError = ref("");

const handleSelect = (item: string) => {
  favoriteFish.value = item;
  favoriteFishError.value = "";
};

const registerUser = async (event: Event) => {
  event.preventDefault();

  if (!username.value) {
    usernameError.value = "ユーザー名を入力してください。";
  } else {
    usernameError.value = "";
  }

  if (!password.value) {
    passwordError.value = "パスワードを入力してください。";
  } else {
    passwordError.value = "";
  }

  if (!favoriteFish.value) {
    favoriteFishError.value = "好きな魚を選択してください。";
  }

  if (
    !usernameError.value &&
    !passwordError.value &&
    !favoriteFishError.value
  ) {
    const result = await userStore.login(
      username.value,
      password.value,
      favoriteFish.value
    );

    if (result.success) {
      router.push("/");
    } else {
      errorMessage.value = "ログインに失敗しました";
    }
  }
};
</script>

<style scoped>
.form-container {
  .register-form > * {
    margin-bottom: 1.8rem;
  }

  .register-form > *:last-child {
    margin-bottom: 0;
  }

  .error-message {
    margin-top: 1rem;
  }
}
</style>

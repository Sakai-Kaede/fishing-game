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
          <AtomsTextInput
            v-model="confirmPassword"
            id="confirmPassword"
            name="confirmPassword"
            label="確認用パスワード："
            type="password"
            :size="'large'"
            :errorMessage="confirmPasswordError"
            @focus="confirmPasswordError = ''"
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
          <AtomsButton size="large" type="submit">登録</AtomsButton>
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
const confirmPassword = ref("");
const favoriteFish = ref("");
const errorMessage = ref("");
const userStore = useUserStore();
const router = useRouter();

const passwordError = ref("");
const usernameError = ref("");
const confirmPasswordError = ref("");
const favoriteFishError = ref("");

const handleSelect = (item: string) => {
  favoriteFish.value = item;
  favoriteFishError.value = "";
};

const registerUser = async (event: Event) => {
  event.preventDefault();

  if (!username.value) {
    usernameError.value = "ユーザー名は必須です。";
  } else if (username.value.length < 3) {
    usernameError.value = "ユーザー名は3文字以上で入力してください。";
  } else {
    usernameError.value = "";
  }

  if (!password.value) {
    passwordError.value = "パスワードは必須です。";
  } else if (password.value.length < 6) {
    passwordError.value = "パスワードは6文字以上で入力してください。";
  } else {
    passwordError.value = "";
  }

  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = "パスワードが一致しません。";
  } else {
    confirmPasswordError.value = "";
  }

  if (!favoriteFish.value) {
    favoriteFishError.value = "好きな魚を選択してください。";
  }

  if (
    !usernameError.value &&
    !passwordError.value &&
    !confirmPasswordError.value &&
    !favoriteFishError.value
  ) {
    const result = await userStore.register(
      username.value,
      password.value,
      favoriteFish.value
    );

    if (result.success) {
      router.push("/");
    } else {
      if (result.message === "その名前は既に使用されています") {
        usernameError.value = result.message;
      } else {
        errorMessage.value = "ユーザー登録に失敗しました";
      }
    }
  }
};
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;

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

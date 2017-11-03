<template>
  <div v-if="!small" class="schedule-md">
    <div class="times">
      <div v-for="time in times" v-text="time"></div>
    </div><!--
 --><div class="schedule-days">
      <Column class="schedule-column" :slots="slotsPerColumn" :name="day" v-for="(day, i) in days" :key="i">
        <Class v-for="c in classesByDay(i)"
               :key="`${c.name}-${c.class}-${c.type}`"
               :name="c.name"
               :className="c.class"
               :room="c.room"
               :teacher="c.teacher"
               :type="c.type"
               :height="`${c.duration * 31}px`"
               :top="`${(c.hour - 8) * 2 * 31}px`"
               :time="c.time"></Class>
      </Column>
    </div>
  </div>
  <div v-else class="schedule-sm">
    Small layout
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Column from './Column';
  import Class from './Class';

  export default {
    components: {
      Column,
      Class,
    },
    name: 'Schedule',
    data() {
      return {
        start: 8,
        end: 24,
        days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      };
    },
    mounted() {
      this.$store.dispatch('getScheduleData');
    },
    computed: {
      ...mapGetters({
        selectedClasses: 'selectedClasses',
        loading: 'loading',
      }),
      small() {
        return this.$mq.resize && this.$mq.below(768);
      },
      slotsPerColumn() {
        return 2 * (this.end - this.start);
      },
      times() {
        return Array(this.end - this.start + 1).fill(0)
          .map((_, i) => this.start + i)
          .map(x => (x < 10 ? `0${x}:00` : `${x}:00`));
      },
    },
    methods: {
      classesByDay(day) {
        if (!this.selectedClasses) return null;
        return this.selectedClasses.filter(c => c.day === day);
      },
    },
  };
</script>

<style scoped>
  .times {
    vertical-align: top;
    width: 50px;
    display: inline-block;
    text-align: right;
    margin-top: 40px;
  }
  .times > div {
    font-weight: bold;
    height: 62px;
    margin-right: 10px;
    position: relative;
  }
  .schedule-md {
    text-align: left;
    margin: 10px auto;
    max-width: 900px;
    padding: 0 20px;
  }
  .schedule-days {
    display: inline-block;
    width: calc(100% - 50px);
  }
  .schedule-column {
    display: inline-block;
    position: relative;
    width: 16.6%;
    box-sizing: border-box;
  }
</style>

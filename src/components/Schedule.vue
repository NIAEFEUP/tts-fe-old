<template>
  <div class="schedule schedule-md" v-if="!small">
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
               :height="`${c.duration * (boxHeight + 1)}px`"
               :top="`${(c.hour - start) * 2 * (boxHeight + 1)}px`"
               :time="c.time"></Class>
      </Column>
    </div>
  </div>
  <div class="schedule schedule-sm" v-else>
    <Column class="schedule-column" horizontal :slots="slotsPerColumn" :name="day" v-for="(day, i) in days" :key="i">
      <Class v-for="c in classesByDay(i)"
             horizontal
             :key="`${c.name}-${c.class}-${c.type}`"
             :name="c.name"
             :className="c.class"
             :room="c.room"
             :teacher="c.teacher"
             :type="c.type"
             :time="c.time"></Class>
    </Column>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  // eslint-disable-next-line import/no-webpack-loader-syntax
  import styles from '!!sass-variable-loader!../styles/variables.scss';
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
        boxHeight: parseInt(styles.scheduleBoxHeight, 10),
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
        return this.$mq.resize && !this.$mq.above(768);
      },
      slotsPerColumn() {
        return 2 * (this.end - this.start);
      },
      times() {
        return Array(this.end - this.start + 1).fill(0)
          .map((_, i) => this.start + i)
          .map(x => (x < 10 ? `0${x}:00` : `${x}:00`));
      },
      classesByDay() {
        const classesByDay = this.groupBy(this.selectedClasses, 'day');
        Object.keys(classesByDay).forEach((key) => {
          classesByDay[key].sort((a, b) => a.hour > b.hour);
        });
        return day => classesByDay[day + 1] || [];
      },
    },
    methods: {
      groupBy(array, field) {
        const obj = {};
        if (!(array instanceof Array)) {
          return obj;
        }
        array.forEach((elem) => {
          if (obj[elem[field]] === undefined) {
            obj[elem[field]] = [];
          }
          obj[elem[field]].push(elem);
        });
        return obj;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../styles/variables';

  .times {
    vertical-align: top;
    width: 50px;
    display: inline-block;
    text-align: right;
    margin-top: 33px;
  }
  .times > div {
    font-size: 15px;
    font-weight: bold;
    height: 2 * $schedule-box-height + 2;
    margin-right: 10px;
    position: relative;
  }
  .schedule {
    text-align: left;
  }
  .schedule-md {
    margin: auto;
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
